import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const TARGET_URL = "https://portifolio-thiago-ibrahim.vercel.app/";

const VIEWPORTS = [
  { id: "desktop-fhd", name: "Full HD (1920x1080)", width: 1920, height: 1080 },
  { id: "desktop-mac", name: "Laptop (1440x900)", width: 1440, height: 900 },
  { id: "desktop-hd", name: "HD (1280x720)", width: 1280, height: 720 },
];

const auditLog = [];

function record(section, viewport, action, expected, obtained, status, severity, details = "") {
  auditLog.push({
    section,
    viewport,
    action,
    expected,
    obtained,
    status, // PASS, WARN, FAIL
    severity,
    details,
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

const artDir = path.resolve("tools/art/desktop-qa");
fs.mkdirSync(artDir, { recursive: true });

for (const vp of VIEWPORTS) {
  console.log(`\n========================================`);
  console.log(`INICIANDO AUDITORIA DESKTOP: ${vp.name}`);
  console.log(`========================================`);

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    permissions: ["clipboard-read", "clipboard-write"],
  });

  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleLogs.push(msg.text());
  });

  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  // 1. CARREGAMENTO DA PÁGINA
  await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 35000 });
  await page.waitForTimeout(1000);

  // 2. CHECAGEM DE OVERFLOW HORIZONTAL GLOBAL
  const pageOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      diff: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  record("Layout Desktop", vp.name, "Verificação de Overflow Horizontal", "scrollWidth <= clientWidth (0px)", `diff = ${pageOverflow.diff}px`, pageOverflow.diff <= 0 ? "PASS" : "FAIL", "Crítico", "Sem barra de rolagem lateral espúria.");

  // 3. NAVBAR SUPERIOR DESKTOP
  // 3.1 Clicar em cada link da barra superior
  const navLinks = [
    { label: "Projetos", href: "#projetos", targetId: "projetos" },
    { label: "Arsenal", href: "#arsenal", targetId: "arsenal" },
    { label: "Jornada", href: "#jornada", targetId: "jornada" },
    { label: "Princípios", href: "#principios", targetId: "principios" },
    { label: "Contato", href: "#contato", targetId: "contato" },
  ];

  for (const item of navLinks) {
    const linkLocator = page.locator(`header nav a[href="${item.href}"]`).first();
    const isVisible = await linkLocator.isVisible();
    if (isVisible) {
      await linkLocator.click();
      await page.waitForTimeout(750);

      const targetTop = await page.evaluate((id) => document.getElementById(id)?.offsetTop || 0, item.targetId);
      const scrollY = await page.evaluate(() => window.scrollY);
      const isClose = Math.abs(scrollY - (targetTop - 80)) < 180;

      record("Navbar Desktop", vp.name, `Clique no link '${item.label}'`, `Rolagem suave via Anime.js até ~${targetTop - 80}px`, `Posição atual: ${Math.round(scrollY)}px (Alvo: ${targetTop})`, isClose ? "PASS" : "WARN", "Médio");
    } else {
      record("Navbar Desktop", vp.name, `Visibilidade do link '${item.label}'`, "Link visível no header", "Link não visível", "FAIL", "Médio");
    }
  }

  // 3.2 Clique no Logo TT (retornar ao topo)
  const logoLocator = page.locator('header a[href="#hero"]').first();
  await logoLocator.click();
  await page.waitForTimeout(750);
  const scrollAfterLogo = await page.evaluate(() => window.scrollY);
  record("Navbar Desktop", vp.name, "Clique no Logo TT", "Rolar até o topo (#hero)", `Posição Y: ${Math.round(scrollAfterLogo)}px`, scrollAfterLogo < 150 ? "PASS" : "WARN", "Médio");

  // 3.3 Botão GITHUB da Navbar
  const githubBtn = page.locator('header a[href*="github.com"]').first();
  const githubHref = await githubBtn.getAttribute("href");
  const githubTarget = await githubBtn.getAttribute("target");
  record("Navbar Desktop", vp.name, "Botão GITHUB Header", "Link externo abrindo em nova aba (target='_blank')", `Href: ${githubHref}, target: ${githubTarget}`, (githubHref?.includes("github.com/ThiagoIbrahimVieira") && githubTarget === "_blank") ? "PASS" : "FAIL", "Médio");

  // 4. SECTIONNAVIGATOR LATERAL (DESKTOP)
  const secNavVisible = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Navegação rápida de seções"]');
    if (!aside) return false;
    const style = window.getComputedStyle(aside);
    return style.display !== "none" && style.visibility !== "hidden";
  });
  record("SectionNavigator", vp.name, "Visibilidade do Navegador Lateral", "Visível no desktop fixado na lateral direita", `Visível: ${secNavVisible}`, secNavVisible ? "PASS" : "FAIL", "Médio");

  // Testar clique em marcador de seção no SectionNavigator (ex: Seção 02 - Projetos)
  const secDot2 = page.locator('aside[aria-label="Navegação rápida de seções"] button[aria-label*="PROJETOS"]').first();
  if (await secDot2.count() > 0) {
    await secDot2.click();
    await page.waitForTimeout(750);
    const scrollYAfterDot = await page.evaluate(() => window.scrollY);
    const projTop = await page.evaluate(() => document.getElementById("projetos")?.offsetTop || 0);
    const isCloseDot = Math.abs(scrollYAfterDot - (projTop - 80)) < 180;
    record("SectionNavigator", vp.name, "Clique no Marcador '02 // PROJETOS'", `Rolar até seção de Projetos`, `Posição Y: ${Math.round(scrollYAfterDot)}px`, isCloseDot ? "PASS" : "WARN", "Médio");
  }

  // Testar botão seta próxima seção
  const nextSecBtn = page.locator('aside[aria-label="Navegação rápida de seções"] button[title*="Avançar"]').first();
  if (await nextSecBtn.count() > 0) {
    await nextSecBtn.click();
    await page.waitForTimeout(750);
    const scrollYAfterNext = await page.evaluate(() => window.scrollY);
    record("SectionNavigator", vp.name, "Clique no Botão Seta 'Avançar seção'", "Avançar scroll para próxima seção", `Posição Y: ${Math.round(scrollYAfterNext)}px`, scrollYAfterNext > 0 ? "PASS" : "WARN", "Baixo");
  }

  // 5. HERO SECTION (DESKTOP)
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 5.1 Selo Circular Rotativo Animado
  const rotatingSeal = await page.evaluate(() => {
    const svg = document.querySelector("#hero svg.animate-spin-slow");
    const textPath = svg?.querySelector("textPath");
    const ttBadge = svg?.parentElement?.querySelector("span");
    return {
      svgFound: !!svg,
      text: textPath?.textContent?.trim(),
      ttFound: ttBadge?.textContent?.trim() === "TT",
    };
  });
  record("Hero Section", vp.name, "Selo Circular Rotativo Animado", "SVG com rotação contínua e texto 'THIAGO IBRAHIM • 1º TÉCNICO EM INFORMÁTICA'", `Encontrado: ${rotatingSeal.svgFound}, Texto: '${rotatingSeal.text?.slice(0, 35)}...', Selo TT: ${rotatingSeal.ttFound}`, (rotatingSeal.svgFound && rotatingSeal.ttFound) ? "PASS" : "FAIL", "Médio");

  // 5.2 Sticker Die-cut e fita "THIAGO // 1º TI"
  const heroSticker = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Thiago Ibrahim — Retrato recortado"]');
    const container = img?.closest(".sticker-die-cut") || img?.parentElement?.parentElement;
    const tape = container?.querySelector(".tape-strip");
    return {
      imgLoaded: img?.complete && (img?.naturalWidth || 0) > 0,
      tapeText: tape?.innerText?.trim(),
    };
  });
  record("Hero Section", vp.name, "Sticker Die-Cut 3:4 & Fita", "Foto carregada com fita 'THIAGO // 1º TI' inclinada", `Foto carregada: ${heroSticker.imgLoaded}, Fita: '${heroSticker.tapeText}'`, (heroSticker.imgLoaded && heroSticker.tapeText?.includes("THIAGO // 1º TI")) ? "PASS" : "FAIL", "Médio");

  // 5.3 Card Manifesto do Construtor
  const manifesto = await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll("#hero div")).find((d) => d.innerText.includes("// MANIFESTO DO CONSTRUTOR"));
    const tape = card?.querySelector(".tape-strip");
    const textP = card?.querySelector("p.italic");
    const tapeRect = tape?.getBoundingClientRect();
    const textRect = textP?.getBoundingClientRect();

    let overlaps = false;
    if (tapeRect && textRect) {
      overlaps = !(tapeRect.bottom <= textRect.top || tapeRect.top >= textRect.bottom || tapeRect.right <= textRect.left || tapeRect.left >= textRect.right);
    }

    return {
      cardFound: !!card,
      tapeText: tape?.innerText?.trim(),
      overlaps,
    };
  });
  record("Hero Section", vp.name, "Card Manifesto do Construtor", "Card manifesto centralizado com fita no canto sem sobrepor texto", `Encontrado: ${manifesto.cardFound}, Fita: '${manifesto.tapeText}', Sobreposição: ${manifesto.overlaps}`, (manifesto.cardFound && !manifesto.overlaps) ? "PASS" : "FAIL", "Médio");

  // 5.4 Botão CTA Hero -> Projetos
  const heroCtaProjects = page.locator('#hero a[href="#projetos"]').first();
  await heroCtaProjects.click();
  await page.waitForTimeout(750);
  const scrollYAfterHeroCta = await page.evaluate(() => window.scrollY);
  record("Hero Section", vp.name, "Clique no CTA 'VER OS 4 PROJETOS NUCLEARES'", "Rolar suavemente até a seção de Projetos", `Posição Y após clique: ${Math.round(scrollYAfterHeroCta)}px`, scrollYAfterHeroCta > 500 ? "PASS" : "WARN", "Médio");

  // 6. SEÇÃO DE PROJETOS (DESKTOP)
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 6.1 Grafo AST ConstellationCanvas (Pan / Nós / Interatividade)
  const canvasAudit = await page.evaluate(() => {
    const canvas = document.querySelector("#projetos canvas");
    if (!canvas) return { found: false };
    const rect = canvas.getBoundingClientRect();
    return {
      found: true,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });
  record("Seção Projetos", vp.name, "Visualizador Interativo Grafo AST", "Canvas 2D ativo com física orbital e nós interconectados", `Dimensões: ${canvasAudit.width}x${canvasAudit.height}px`, canvasAudit.found ? "PASS" : "FAIL", "Crítico");

  // 6.2 Teste do 3D Tilt e Hover Specular nos Cards Desktop
  const tiltAudit = await page.evaluate(() => {
    const card = document.querySelector("#projetos .hidden.md\\:grid article");
    if (!card) return { found: false };
    const style = window.getComputedStyle(card);
    return {
      found: true,
      hasPerspective: card.getAttribute("style")?.includes("perspective"),
      cursor: style.cursor,
    };
  });
  record("Seção Projetos", vp.name, "Efeito 3D Tilt nos Cards Desktop", "Cards com perspective(1000px) e rotação no hover", `Tilt ativo: ${tiltAudit.hasPerspective}, Cursor: ${tiltAudit.cursor}`, tiltAudit.hasPerspective ? "PASS" : "WARN", "Baixo");

  // 6.3 Teste de Abertura do Modal Técnico em cada um dos 4 Projetos Nucleares
  const featuredCards = page.locator("#projetos .hidden.md\\:grid article");
  const cardsCount = await featuredCards.count();

  for (let i = 0; i < cardsCount; i++) {
    const card = featuredCards.nth(i);
    const projectName = await card.locator("h3").innerText();

    // Clica no botão "VER TELA DO PROJETO & REPO ↗"
    const openBtn = card.locator("button").first();
    await openBtn.click();
    await page.waitForTimeout(500);

    const modalData = await page.evaluate(() => {
      const modal = document.querySelector('div[class*="z-[9999]"]');
      if (!modal) return { open: false };
      const title = modal.querySelector("h3")?.innerText?.trim();
      const pipelineSteps = Array.from(modal.querySelectorAll("span.rounded-lg")).map((s) => s.innerText.trim());
      const copyBtn = Array.from(modal.querySelectorAll("button")).find((b) => b.innerText.includes("Copiar"));
      const githubLink = modal.querySelector('a[href*="github.com"]')?.getAttribute("href");

      return {
        open: true,
        title,
        pipelineCount: pipelineSteps.length,
        hasGithubLink: !!githubLink,
        githubLink,
      };
    });

    record("Seção Projetos", vp.name, `Abertura Modal Técnico: ${projectName}`, "Modal abre em overlay escuro com pipeline e links", `Aberto: ${modalData.open}, Título: ${modalData.title}, Etapas Pipeline: ${modalData.pipelineCount}, GitHub: ${modalData.githubLink}`, modalData.open ? "PASS" : "FAIL", "Crítico");

    // Fecha o modal via tecla [ESC] ou botão FECHAR
    if (i % 2 === 0) {
      await page.keyboard.press("Escape");
    } else {
      const closeBtn = page.locator('div[class*="z-[9999]"] button:has-text("FECHAR")').first();
      await closeBtn.click();
    }
    await page.waitForTimeout(400);

    const isClosed = await page.evaluate(() => !document.querySelector('div[class*="z-[9999]"]'));
    record("Seção Projetos", vp.name, `Fechamento Modal: ${projectName}`, "Modal fecha e restaura overflow", `Fechado: ${isClosed}`, isClosed ? "PASS" : "FAIL", "Crítico");
  }

  // 6.4 Checagem dos links externos do GitHub nos cards de projetos
  const githubLinksData = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("#projetos a[href*='github.com']"));
    return links.map((a) => ({
      href: a.getAttribute("href"),
      target: a.getAttribute("target"),
      rel: a.getAttribute("rel"),
    }));
  });

  const allGithubValid = githubLinksData.every((l) => l.href.includes("github.com/ThiagoIbrahimVieira") && l.target === "_blank");
  record("Seção Projetos", vp.name, "Links Externos de Repositórios GitHub", "Todos os links apontam para ThiagoIbrahimVieira com target='_blank'", `Total de links testados: ${githubLinksData.length}, Válidos: ${allGithubValid}`, allGithubValid ? "PASS" : "FAIL", "Médio");

  // 6.5 Washi Tapes nos cards (sem corte e sem sobreposição em badges)
  const washiTapesAudit = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("#projetos article"));
    let overlapsCount = 0;
    cards.forEach((card) => {
      const tape = card.querySelector(".tape-strip");
      const badge = card.querySelector(".badge-sticker");
      if (tape && badge) {
        const tRect = tape.getBoundingClientRect();
        const bRect = badge.getBoundingClientRect();
        const overlap = !(tRect.bottom <= bRect.top || tRect.top >= bRect.bottom || tRect.right <= bRect.left || tRect.left >= bRect.right);
        if (overlap) overlapsCount++;
      }
    });
    return { totalCards: cards.length, overlapsCount };
  });
  record("Seção Projetos", vp.name, "Washi Tapes nos Cards (Posicionamento)", "Inclinadas na ponta superior direita sem sobrepor badges", `Total de cards: ${washiTapesAudit.totalCards}, Colisões: ${washiTapesAudit.overlapsCount}`, washiTapesAudit.overlapsCount === 0 ? "PASS" : "FAIL", "Médio");

  // 7. ARSENAL TÉCNICO & PRINCÍPIOS (DESKTOP)
  await page.locator("#arsenal").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const arsenalDesktopAudit = await page.evaluate(() => {
    const grid = document.querySelector("#arsenal .hidden.md\\:grid");
    if (!grid) return { found: false };
    const groups = Array.from(grid.querySelectorAll("h3")).map((h) => h.innerText.trim());
    const itemsCount = grid.querySelectorAll("li").length;
    return {
      found: true,
      groupsCount: groups.length,
      groups,
      itemsCount,
    };
  });
  record("Arsenal Técnico", vp.name, "Grid Desktop de Stacks (4 Categorias)", "Grid 2x2 com 4 categorias e 10 tecnologias homologadas", `Categorias: ${arsenalDesktopAudit.groupsCount} (${arsenalDesktopAudit.groups?.join(", ")}), Itens: ${arsenalDesktopAudit.itemsCount}`, (arsenalDesktopAudit.groupsCount === 4 && arsenalDesktopAudit.itemsCount >= 10) ? "PASS" : "FAIL", "Médio");

  // Princípios de Construção
  await page.locator("#principios").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const principiosDesktopAudit = await page.evaluate(() => {
    const grid = document.querySelector("#principios .hidden.sm\\:grid");
    if (!grid) return { found: false };
    const items = Array.from(grid.querySelectorAll("h3")).map((h) => h.innerText.trim());
    return {
      found: true,
      count: items.length,
      items,
    };
  });
  record("Princípios", vp.name, "Grid Desktop de Princípios (4 Pilares)", "Grid com 4 princípios de engenharia e governança", `Pilares encontrados: ${principiosDesktopAudit.count} (${principiosDesktopAudit.items?.join(", ")})`, principiosDesktopAudit.count === 4 ? "PASS" : "FAIL", "Médio");

  // 8. JORNADA DE ENGENHARIA (DESKTOP)
  await page.locator("#jornada").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const jornadaDesktopAudit = await page.evaluate(() => {
    const desktopAuthorCard = document.querySelector("#jornada .hidden.lg\\:flex");
    const img = desktopAuthorCard?.querySelector("img");
    const timelineItems = Array.from(document.querySelectorAll("#jornada .space-y-5 > div, #jornada .space-y-8 > div"));

    return {
      authorCardVisible: !!desktopAuthorCard,
      authorImgLoaded: img?.complete && (img?.naturalWidth || 0) > 0,
      timelineCount: timelineItems.length,
    };
  });
  record("Jornada", vp.name, "Coluna Desktop do Autor & Linha do Tempo", "Card de perfil à direita com foto carregada e 5 marcos de timeline à esquerda", `Card visível: ${jornadaDesktopAudit.authorCardVisible}, Foto carregada: ${jornadaDesktopAudit.authorImgLoaded}, Marcos: ${jornadaDesktopAudit.timelineCount}`, (jornadaDesktopAudit.authorCardVisible && jornadaDesktopAudit.authorImgLoaded && jornadaDesktopAudit.timelineCount >= 5) ? "PASS" : "FAIL", "Médio");

  // 9. SEÇÃO DE CONTATO (DESKTOP)
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 9.1 Botão Copiar E-mail
  const copyBtn = page.locator('#contato button:has-text("Copiar")').first();
  await copyBtn.click();
  await page.waitForTimeout(350);
  const copiedVisible = await page.locator('#contato button:has-text("Copiado")').count();
  const clipboardContent = await page.evaluate(() => navigator.clipboard.readText().catch(() => ""));
  record("Contato", vp.name, "Clique no Botão 'Copiar E-mail'", "Copia 'thiagoibrahimvieira@gmail.com' e muda botão para 'Copiado!'", `Exibiu 'Copiado!': ${copiedVisible > 0}, Conteúdo copiado: '${clipboardContent}'`, (copiedVisible > 0 && clipboardContent === "thiagoibrahimvieira@gmail.com") ? "PASS" : "FAIL", "Médio");

  // 9.2 Validação de Envio com Campos Vazios
  await page.fill("#contato input#nome", "");
  await page.fill("#contato textarea#msg", "");
  const waBtn = page.locator('#contato button:has-text("WHATSAPP")').first();
  await waBtn.click();
  await page.waitForTimeout(300);
  const errorInline = await page.evaluate(() => document.querySelector("#contato div.bg-red-950\\/70")?.innerText?.trim());
  record("Contato", vp.name, "Validação de Envio Vazio (WhatsApp)", "Exibe alerta vermelho exigindo preenchimento de nome e mensagem", `Mensagem obtida: '${errorInline}'`, errorInline?.includes("nome e a mensagem") ? "PASS" : "FAIL", "Médio");

  // 9.3 Envio no WhatsApp com dados preenchidos
  await page.fill("#contato input#nome", "Steve Rogers Desktop QA");
  await page.fill("#contato input#email", "qa.desktop@shield.org");
  await page.fill("#contato textarea#msg", "Homologação Web Desktop 1920x1080.");

  await page.evaluate(() => {
    window.__desktopOpenedUrls = [];
    window.open = (url) => { window.__desktopOpenedUrls.push(url); return null; };
  });

  await waBtn.click();
  await page.waitForTimeout(400);

  const waOpened = await page.evaluate(() => window.__desktopOpenedUrls);
  const waUrl = waOpened[0] || "";
  const waValid = waUrl.includes("wa.me/5511919498217") && waUrl.includes("Steve") && waUrl.includes("Desktop");
  record("Contato", vp.name, "Clique no Botão 'ENVIAR NO WHATSAPP'", "Gera URL wa.me com número e mensagem URI codificada", `URL: ${waUrl.slice(0, 65)}... (Válida: ${waValid})`, waValid ? "PASS" : "FAIL", "Crítico");

  // 9.4 Envio pelo E-mail (/api/contact)
  const mailBtn = page.locator('#contato button[type="submit"]').first();
  await mailBtn.click();
  await page.waitForTimeout(2000);

  const mailStatus = await page.evaluate(() => {
    const successCard = document.querySelector("#contato div.bg-emerald-950\\/70");
    return {
      success: !!successCard,
      text: successCard?.innerText?.trim(),
    };
  });
  record("Contato", vp.name, "Clique no Botão 'ENVIAR PELO EMAIL'", "Disparo POST para /api/contact e retorno de sucesso do Resend", `Sucesso: ${mailStatus.success}, Mensagem: '${mailStatus.text?.replace(/\n/g, " ")}'`, mailStatus.success ? "PASS" : "FAIL", "Crítico");

  // 10. SCREENSHOTS DE EVIDÊNCIA DESKTOP
  await page.screenshot({ path: `tools/art/desktop-qa/${vp.id}-hero.png`, fullPage: false });
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `tools/art/desktop-qa/${vp.id}-projetos.png`, fullPage: false });
  await page.locator("#arsenal").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `tools/art/desktop-qa/${vp.id}-arsenal.png`, fullPage: false });
  await page.locator("#jornada").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `tools/art/desktop-qa/${vp.id}-jornada.png`, fullPage: false });
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `tools/art/desktop-qa/${vp.id}-contato.png`, fullPage: false });

  // 11. ERROS DE RUNTIME
  record("Erros de Runtime", vp.name, "Console Errors", "Zero erros de console", consoleLogs.length ? `${consoleLogs.length} erros: ${consoleLogs.slice(0, 2).join("; ")}` : "Zero erros", consoleLogs.length === 0 ? "PASS" : "WARN", "Médio");
  record("Erros de Runtime", vp.name, "Page Uncaught Errors", "Zero erros não capturados na página", pageErrors.length ? `${pageErrors.length} erros: ${pageErrors.join("; ")}` : "Zero erros", pageErrors.length === 0 ? "PASS" : "Crítico");

  await context.close();
}

await browser.close();

fs.writeFileSync("tools/art/desktop-qa/audit-desktop-results.json", JSON.stringify(auditLog, null, 2));

console.log("\n========================================================");
console.log("AUDITORIA DESKTOP CONCLUÍDA COM SUCESSO!");
console.log(`Total de testes executados: ${auditLog.length}`);
const passes = auditLog.filter((a) => a.status === "PASS").length;
const warns = auditLog.filter((a) => a.status === "WARN").length;
const fails = auditLog.filter((a) => a.status === "FAIL").length;
console.log(`PASS: ${passes} | WARN: ${warns} | FAIL: ${fails}`);
console.log("========================================================\n");
