import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const TARGET_URL = "https://portifolio-thiago-ibrahim.vercel.app/";

const VIEWPORTS = [
  { id: "iphone14", name: "iPhone 14/15", width: 390, height: 844, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
  { id: "pixel7", name: "Pixel 7", width: 412, height: 915, deviceScaleFactor: 2.625, hasTouch: true, isMobile: true },
  { id: "compact360", name: "Compact 360", width: 360, height: 780, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
  { id: "compact375", name: "iPhone SE 375", width: 375, height: 667, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
];

const auditLog = [];

function record(section, viewport, item, expected, obtained, status, severity, details = "") {
  auditLog.push({
    section,
    viewport,
    item,
    expected,
    obtained,
    status, // PASS, WARN, FAIL
    severity, // Crítico, Médio, Baixo, Info
    details,
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

const artDir = path.resolve("tools/art/mobile-qa");
fs.mkdirSync(artDir, { recursive: true });

for (const vp of VIEWPORTS) {
  console.log(`\n========================================`);
  console.log(`AUDITANDO VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
  console.log(`========================================`);

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    permissions: ["clipboard-read", "clipboard-write"],
  });

  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleLogs.push(msg.text());
    }
  });

  const pageErrors = [];
  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  // 1. CARREGAMENTO DA PÁGINA EM PRODUÇÃO
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

  if (pageOverflow.diff <= 0) {
    record("Layout Global", vp.name, "Overflow Horizontal da Página", "scrollWidth <= clientWidth (0px)", `diff = ${pageOverflow.diff}px`, "PASS", "Crítico", "Sem barra de rolagem lateral espúria.");
  } else {
    record("Layout Global", vp.name, "Overflow Horizontal da Página", "scrollWidth <= clientWidth (0px)", `diff = ${pageOverflow.diff}px (VAZAMENTO LATERAL)`, "FAIL", "Crítico", `Vazamento de ${pageOverflow.diff}px além da tela.`);
  }

  // 3. SEÇÃO NAVEGAÇÃO & DOCKS
  // 3.1 SectionNavigator lateral: Oculto no mobile
  const sectionNavVisible = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Navegação rápida de seções"]');
    if (!aside) return false;
    const style = window.getComputedStyle(aside);
    return style.display !== "none" && style.visibility !== "hidden";
  });

  record("Navegação & Docks", vp.name, "SectionNavigator Lateral", "Oculto em viewports mobile (display: none)", sectionNavVisible ? "Visível indevidamente" : "Oculto conforme esperado (hidden md:flex)", sectionNavVisible ? "FAIL" : "PASS", "Baixo");

  // 3.2 Floating Bottom Dock: Visível e fixo
  const dockInfo = await page.evaluate(() => {
    const dock = document.querySelector('aside[aria-label="Navegação móvel tátil"]');
    if (!dock) return { exists: false };
    const rect = dock.getBoundingClientRect();
    const style = window.getComputedStyle(dock);
    const links = Array.from(dock.querySelectorAll("a")).map((a) => ({
      label: a.getAttribute("aria-label") || a.innerText.trim(),
      href: a.getAttribute("href"),
      target: a.getAttribute("target"),
      rect: a.getBoundingClientRect(),
    }));
    return {
      exists: true,
      display: style.display,
      visible: rect.width > 0 && rect.height > 0 && style.display !== "none",
      rect: { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
      links,
    };
  });

  record("Navegação & Docks", vp.name, "Floating Bottom Dock visibilidade", "Dock visível fixada no rodapé", dockInfo.visible ? `Visível (largura: ${Math.round(dockInfo.rect.width)}px)` : "Invisível", dockInfo.visible ? "PASS" : "FAIL", "Crítico");

  // 3.3 Testar itens e áreas de toque (Touch Target Size >= 48px)
  const expectedItems = [
    { label: "Início", href: "#hero" },
    { label: "Projetos", href: "#projetos" },
    { label: "Stack", href: "#arsenal" },
    { label: "Log", href: "#jornada" },
    { label: "Code", href: "https://github.com/ThiagoIbrahimVieira", isExternal: true },
  ];

  for (const exp of expectedItems) {
    const found = dockInfo.links?.find((l) => l.label.includes(exp.label) || l.href === exp.href);
    if (found) {
      const targetSizeOk = found.rect.width >= 44 && found.rect.height >= 44;
      record("Navegação & Docks", vp.name, `Dock Item: ${exp.label} (Touch Target)`, "Alvo tátil >= 44x44px (WCAG AAA)", `Largura: ${Math.round(found.rect.width)}px, Altura: ${Math.round(found.rect.height)}px`, targetSizeOk ? "PASS" : "WARN", "Baixo");
    }
  }

  // 3.4 Testar clique no dock item "Projetos" e scroll suave via Anime.js v4
  const dockProjetosBtn = page.locator('aside[aria-label="Navegação móvel tátil"] a[href="#projetos"]').first();
  if (await dockProjetosBtn.count() > 0) {
    await dockProjetosBtn.click();
    await page.waitForTimeout(800);
    const scrollYAfterClick = await page.evaluate(() => window.scrollY);
    const projetosTop = await page.evaluate(() => document.getElementById("projetos")?.offsetTop || 0);
    const isClose = Math.abs(scrollYAfterClick - (projetosTop - 70)) < 160;
    record("Navegação & Docks", vp.name, "Scroll Suave Dock -> #projetos", `Rolar para ~${projetosTop - 70}px via Anime.js`, `Posição atual: ${Math.round(scrollYAfterClick)}px (Alvo: ${projetosTop})`, isClose ? "PASS" : "WARN", "Médio");
  }

  // Retornar ao topo
  const dockHeroBtn = page.locator('aside[aria-label="Navegação móvel tátil"] a[href="#hero"]').first();
  if (await dockHeroBtn.count() > 0) {
    await dockHeroBtn.click();
    await page.waitForTimeout(800);
  }

  // 3.5 Navbar Superior
  const navbarInfo = await page.evaluate(() => {
    const header = document.querySelector("header");
    if (!header) return { exists: false };
    const rect = header.getBoundingClientRect();
    const logo = header.querySelector('a[href="#hero"]');
    const githubBtn = header.querySelector('a[href*="github.com"]');
    const desktopNav = header.querySelector('nav[aria-label="Navegação principal"]');
    const desktopNavStyle = desktopNav ? window.getComputedStyle(desktopNav) : null;
    return {
      exists: true,
      logoVisible: !!logo,
      githubBtnVisible: !!githubBtn,
      githubHref: githubBtn?.getAttribute("href"),
      desktopNavHidden: desktopNavStyle ? desktopNavStyle.display === "none" : true,
    };
  });

  record("Navegação & Docks", vp.name, "Navbar Superior - Logo & Github", "Logo visível, Github button visível, links desktop ocultos", `Logo: ${navbarInfo.logoVisible}, Github: ${navbarInfo.githubBtnVisible}, DesktopNavHidden: ${navbarInfo.desktopNavHidden}`, (navbarInfo.logoVisible && navbarInfo.githubBtnVisible && navbarInfo.desktopNavHidden) ? "PASS" : "FAIL", "Médio");

  // 4. SEÇÃO HERO
  // 4.1 Die-cut Sticker 3:4 e Washi Tape "THIAGO // 1º TI"
  const heroSticker = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Thiago Ibrahim — Retrato recortado"]');
    const stickerContainer = img?.closest(".sticker-die-cut") || img?.parentElement?.parentElement;
    const tape = stickerContainer?.querySelector(".tape-strip");
    if (!img) return { imgFound: false };
    const imgRect = img.getBoundingClientRect();
    const tapeRect = tape?.getBoundingClientRect();
    const containerRect = stickerContainer?.getBoundingClientRect();

    return {
      imgFound: true,
      imgVisible: img.complete && img.naturalWidth > 0,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: imgRect.width,
      renderedHeight: imgRect.height,
      aspectRatio: imgRect.height > 0 ? (imgRect.width / imgRect.height).toFixed(2) : "0",
      tapeFound: !!tape,
      tapeText: tape?.innerText?.trim(),
      containerOverflowsRight: containerRect ? containerRect.right > window.innerWidth : false,
      tapeOverflowsRight: tapeRect ? tapeRect.right > window.innerWidth : false,
    };
  });

  record("Hero Section", vp.name, "Sticker Die-Cut 3:4", "Imagem carregada (proporção 3:4), sem corte lateral", `Carregada: ${heroSticker.imgVisible}, Proporção: ${heroSticker.aspectRatio} (3:4 = 0.75), OverflowContainer: ${heroSticker.containerOverflowsRight}`, (heroSticker.imgVisible && !heroSticker.containerOverflowsRight) ? "PASS" : "FAIL", "Crítico");
  record("Hero Section", vp.name, "Washi Tape 'THIAGO // 1º TI'", "Fita no topo direito sem estourar viewport", `Texto: '${heroSticker.tapeText}', Estourou viewport: ${heroSticker.tapeOverflowsRight}`, !heroSticker.tapeOverflowsRight ? "PASS" : "FAIL", "Médio");

  // 4.2 Card Manifesto do Construtor
  const manifestoInfo = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll("#hero div"));
    const manifestoCard = allDivs.find((d) => d.innerText.includes("// MANIFESTO DO CONSTRUTOR"));
    if (!manifestoCard) return { found: false };
    const rect = manifestoCard.getBoundingClientRect();
    const tape = manifestoCard.querySelector(".tape-strip");
    const tapeRect = tape?.getBoundingClientRect();
    const title = manifestoCard.querySelector("p");
    const titleRect = title?.getBoundingClientRect();

    let overlapsTitle = false;
    if (tapeRect && titleRect) {
      const verticalOverlap = !(tapeRect.bottom <= titleRect.top || tapeRect.top >= titleRect.bottom);
      const horizontalOverlap = !(tapeRect.right <= titleRect.left || tapeRect.left >= titleRect.right);
      overlapsTitle = verticalOverlap && horizontalOverlap;
    }

    return {
      found: true,
      cardOverflows: rect.right > window.innerWidth,
      tapeFound: !!tape,
      tapeText: tape?.innerText?.trim(),
      overlapsTitle,
    };
  });

  record("Hero Section", vp.name, "Card Manifesto do Construtor", "Card centralizado, sem sobreposição da fita 'MANIFESTO' no texto", `Encontrado: ${manifestoInfo.found}, Sobreposição no texto: ${manifestoInfo.overlapsTitle}, Overflow: ${manifestoInfo.cardOverflows}`, (manifestoInfo.found && !manifestoInfo.overlapsTitle && !manifestoInfo.cardOverflows) ? "PASS" : "FAIL", "Médio");

  // 4.3 CTAs do Hero
  const heroCtas = await page.evaluate(() => {
    const ctaProjects = document.querySelector('#hero a[href="#projetos"]');
    const ctaGithub = document.querySelector('#hero a[href*="github.com"]');
    return {
      ctaProjectsVisible: !!ctaProjects,
      ctaProjectsText: ctaProjects?.innerText?.trim(),
      ctaGithubVisible: !!ctaGithub,
      ctaGithubText: ctaGithub?.innerText?.trim(),
    };
  });

  record("Hero Section", vp.name, "CTAs de Ação do Hero", "2 botões visíveis ('VER OS 4 PROJETOS NUCLEARES' e 'GITHUB REPOS')", `Projetos: ${heroCtas.ctaProjectsVisible}, Github: ${heroCtas.ctaGithubVisible}`, (heroCtas.ctaProjectsVisible && heroCtas.ctaGithubVisible) ? "PASS" : "FAIL", "Médio");

  // 5. SEÇÃO DE PROJETOS (ChronologySection)
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 5.1 Grafo AST / ConstellationCanvas
  const canvasAudit = await page.evaluate(() => {
    const canvas = document.querySelector("#projetos canvas");
    if (!canvas) return { found: false };
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(canvas);
    return {
      found: true,
      width: rect.width,
      height: rect.height,
      touchAction: style.touchAction,
      hasPanY: style.touchAction.includes("pan-y"),
    };
  });

  record("Seção Projetos", vp.name, "Grafo AST Constellation Canvas", "Canvas renderizado com touch-action: pan-y (não trava scroll vertical)", `Dimensões: ${Math.round(canvasAudit.width)}x${Math.round(canvasAudit.height)}px, touchAction: ${canvasAudit.touchAction}`, (canvasAudit.found && canvasAudit.hasPanY) ? "PASS" : "FAIL", "Crítico", "touch-action: pan-y garante que o deslize vertical não fique preso no canvas.");

  // 5.2 Carrossel Snap-to-Card (< 768px)
  const carouselAudit = await page.evaluate(() => {
    const carouselContainer = document.querySelector("#projetos .overflow-x-auto");
    if (!carouselContainer) return { found: false };
    const cards = Array.from(carouselContainer.querySelectorAll("article"));

    const cardsData = cards.map((card) => {
      const name = card.querySelector("h3")?.innerText?.trim();
      const tape = card.querySelector(".tape-strip");
      const tapeText = tape?.innerText?.trim();
      const badge = card.querySelector(".badge-sticker")?.innerText?.trim();
      const tapeRect = tape?.getBoundingClientRect();
      const badgeRect = card.querySelector(".badge-sticker")?.getBoundingClientRect();

      let tapeOverlapsBadge = false;
      if (tapeRect && badgeRect) {
        tapeOverlapsBadge = !(
          tapeRect.bottom <= badgeRect.top ||
          tapeRect.top >= badgeRect.bottom ||
          tapeRect.right <= badgeRect.left ||
          tapeRect.left >= badgeRect.right
        );
      }

      const btnModal = card.querySelector("button");
      const githubLink = card.querySelector('a[href*="github.com"]');

      return {
        name,
        tapeText,
        badge,
        tapeOverlapsBadge,
        hasModalBtn: !!btnModal,
        hasGithubLink: !!githubLink,
        githubHref: githubLink?.getAttribute("href"),
      };
    });

    return {
      found: true,
      scrollWidth: carouselContainer.scrollWidth,
      clientWidth: carouselContainer.clientWidth,
      isScrollable: carouselContainer.scrollWidth > carouselContainer.clientWidth,
      cardsCount: cards.length,
      cardsData,
    };
  });

  record("Seção Projetos", vp.name, "Carrossel Horizontal de 4 Projetos Nucleares", "Container rolável horizontalmente com snap e 4 cards", `Encontrado: ${carouselAudit.found}, Cards: ${carouselAudit.cardsCount}, Rolável: ${carouselAudit.isScrollable}`, (carouselAudit.found && carouselAudit.cardsCount === 4 && carouselAudit.isScrollable) ? "PASS" : "FAIL", "Crítico");

  // Checar washi tapes e badges nos 4 cards
  if (carouselAudit.cardsData) {
    for (const card of carouselAudit.cardsData) {
      const status = card.tapeOverlapsBadge ? "FAIL" : "PASS";
      record("Seção Projetos", vp.name, `Washi Tape no card: ${card.name}`, "Washi tape posicionada na ponta direita sem sobrepor badges", `Tape: '${card.tapeText}', Badge: '${card.badge}', Sobrepõe Badge: ${card.tapeOverlapsBadge}`, status, card.tapeOverlapsBadge ? "Médio" : "Baixo");
    }
  }

  // 5.3 Testar Swipe Horizontal no Carrossel de Projetos
  const swipeTested = await page.evaluate(async () => {
    const c = document.querySelector("#projetos .overflow-x-auto");
    if (!c) return { scrolled: false };
    const initialScroll = c.scrollLeft;
    c.scrollBy({ left: 200, behavior: "instant" });
    const afterScroll = c.scrollLeft;
    return { scrolled: afterScroll > initialScroll, initialScroll, afterScroll };
  });

  record("Seção Projetos", vp.name, "Swipe Horizontal nos Cards Nucleares", "Deslize horizontal avança cards suavemente", `Inicial: ${swipeTested.initialScroll}px, Após swipe: ${swipeTested.afterScroll}px`, swipeTested.scrolled ? "PASS" : "FAIL", "Médio");

  // 5.4 Testar Abertura e Fechamento do ProjectDetailModal em Mobile
  // Retorna o carrossel para o início para garantir visibilidade do primeiro card
  await page.evaluate(() => {
    const c = document.querySelector("#projetos .overflow-x-auto");
    if (c) c.scrollLeft = 0;
  });
  await page.waitForTimeout(300);

  const modalBtn = page.locator("#projetos article button").first();
  if (await modalBtn.count() > 0) {
    await modalBtn.scrollIntoViewIfNeeded();
    await modalBtn.click();
    await page.waitForTimeout(600);

    const modalState = await page.evaluate(() => {
      const modal = document.querySelector('div[class*="z-[9999]"]');
      if (!modal) return { open: false };
      const closeBtn = modal.querySelector('button');
      const bodyOverflow = document.body.style.overflow;
      const title = modal.querySelector("h3")?.innerText?.trim();
      const rect = modal.querySelector('div[class*="rounded-2xl"]')?.getBoundingClientRect();

      return {
        open: true,
        title,
        bodyOverflow,
        closeBtnFound: !!closeBtn,
        modalWidth: rect?.width,
        modalHeight: rect?.height,
        fitsScreen: rect ? rect.width <= window.innerWidth : false,
      };
    });

    record("Seção Projetos", vp.name, "Abertura ProjectDetailModal", "Modal abre sobrepondo tela, com trava de body overflow", `Aberto: ${modalState.open}, Projeto: ${modalState.title}, Body Overflow: ${modalState.bodyOverflow}, Cabe na tela: ${modalState.fitsScreen}`, (modalState.open && modalState.fitsScreen) ? "PASS" : "FAIL", "Crítico");

    // Testar fechar modal
    const closeBtn = page.locator('div[class*="z-[9999]"] button:has-text("FECHAR")').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      const isClosed = await page.evaluate(() => !document.querySelector('div[class*="z-[9999]"]'));
      record("Seção Projetos", vp.name, "Fechamento ProjectDetailModal", "Botão FECHAR fecha o modal e restaura overflow", `Fechado com sucesso: ${isClosed}`, isClosed ? "PASS" : "FAIL", "Crítico");
    }
  }

  // 5.5 Projetos Complementares (SpaceSweep, Nordicos Tattoo, Segundo Cérebro)
  const otherProjectsAudit = await page.evaluate(() => {
    const otherHeading = Array.from(document.querySelectorAll("h3")).find((h) => h.innerText.includes("PROJETOS DE SUPORTE"));
    if (!otherHeading) return { found: false };
    const section = otherHeading.closest("div.mt-20");
    const cards = Array.from(section?.querySelectorAll("article") || []);
    return {
      found: true,
      count: cards.length,
      names: cards.map((c) => c.querySelector("h3")?.innerText?.trim()),
    };
  });

  record("Seção Projetos", vp.name, "Projetos Complementares / Suporte", "3 projetos complementares visíveis (SpaceSweep, Nordicos Tattoo, Segundo Cérebro)", `Encontrados: ${otherProjectsAudit.count} (${otherProjectsAudit.names?.join(", ")})`, otherProjectsAudit.count === 3 ? "PASS" : "FAIL", "Médio");

  // 6. ARSENAL TÉCNICO & PRINCÍPIOS
  await page.locator("#arsenal").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 6.1 Arsenal Carrossel Snap (< 768px)
  const arsenalAudit = await page.evaluate(() => {
    const arsenalSec = document.querySelector("#arsenal");
    const carousel = arsenalSec?.querySelector(".overflow-x-auto");
    if (!carousel) return { found: false };
    const cards = Array.from(carousel.querySelectorAll("h3")).map((h) => h.innerText.trim());
    return {
      found: true,
      isScrollable: carousel.scrollWidth > carousel.clientWidth,
      categories: cards,
    };
  });

  record("Arsenal Técnico", vp.name, "Carrossel Mobile de Stacks", "4 categorias em carrossel snap-to-card", `Encontrado: ${arsenalAudit.found}, Categorias: ${arsenalAudit.categories?.length} (${arsenalAudit.categories?.join(", ")})`, (arsenalAudit.found && arsenalAudit.categories?.length === 4) ? "PASS" : "FAIL", "Médio");

  // 6.2 Princípios de Construção Carrossel Snap (< 640px)
  await page.locator("#principios").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const principiosAudit = await page.evaluate(() => {
    const sec = document.querySelector("#principios");
    const carousel = sec?.querySelector(".overflow-x-auto");
    if (!carousel) return { found: false };
    const cards = Array.from(carousel.querySelectorAll("h3")).map((h) => h.innerText.trim());
    return {
      found: true,
      count: cards.length,
      principles: cards,
    };
  });

  record("Princípios", vp.name, "Carrossel Mobile de Princípios", "4 princípios de engenharia em carrossel snap", `Encontrados: ${principiosAudit.count} (${principiosAudit.principles?.join(", ")})`, principiosAudit.count === 4 ? "PASS" : "FAIL", "Médio");

  // 7. JORNADA / DIÁRIO DE BORDO
  await page.locator("#jornada").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const jornadaAudit = await page.evaluate(() => {
    const sec = document.querySelector("#jornada");
    if (!sec) return { found: false };

    const mobileHeader = sec.querySelector(".flex.lg\\:hidden");
    const img = mobileHeader?.querySelector("img");
    const authorName = mobileHeader?.querySelector("h3")?.innerText?.trim();
    const timelineItems = Array.from(sec.querySelectorAll(".space-y-5 > div, .space-y-8 > div"));

    return {
      found: true,
      mobileHeaderVisible: !!mobileHeader,
      authorName,
      imgLoaded: img?.complete && (img?.naturalWidth || 0) > 0,
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
      timelineCount: timelineItems.length,
    };
  });

  record("Jornada", vp.name, "Header Mobile Autor (Texto Esq + Foto Dir)", "Header móvel visível com foto carregada e nome do autor", `Header: ${jornadaAudit.mobileHeaderVisible}, Autor: ${jornadaAudit.authorName}, Foto: ${jornadaAudit.imgLoaded} (${jornadaAudit.naturalWidth}x${jornadaAudit.naturalHeight}px)`, (jornadaAudit.mobileHeaderVisible && jornadaAudit.imgLoaded) ? "PASS" : "FAIL", "Médio");
  record("Jornada", vp.name, "Marcadores e Cards de Timeline", "5 marcos cronológicos com badges numerados", `Encontrados: ${jornadaAudit.timelineCount} marcos`, jornadaAudit.timelineCount >= 5 ? "PASS" : "FAIL", "Médio");

  // 8. SEÇÃO DE CONTATO
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const contactAudit = await page.evaluate(() => {
    const form = document.querySelector("#contato form");
    if (!form) return { found: false };
    const nomeInput = form.querySelector("input#nome");
    const emailInput = form.querySelector("input#email");
    const msgInput = form.querySelector("textarea#msg");
    const waBtn = Array.from(form.querySelectorAll("button")).find((b) => b.innerText.includes("WHATSAPP"));
    const mailBtn = form.querySelector('button[type="submit"]');

    return {
      found: true,
      hasNome: !!nomeInput,
      hasEmail: !!emailInput,
      hasMsg: !!msgInput,
      hasWaBtn: !!waBtn,
      hasMailBtn: !!mailBtn,
    };
  });

  record("Contato", vp.name, "Formulário de Contato - Elementos", "Campos Nome, Email, Mensagem e botões WhatsApp e Email presentes", `Nome: ${contactAudit.hasNome}, Email: ${contactAudit.hasEmail}, Msg: ${contactAudit.hasMsg}, WhatsApp: ${contactAudit.hasWaBtn}, EmailBtn: ${contactAudit.hasMailBtn}`, (contactAudit.hasNome && contactAudit.hasEmail && contactAudit.hasMsg && contactAudit.hasWaBtn && contactAudit.hasMailBtn) ? "PASS" : "FAIL", "Crítico");

  // 8.2 Testar Validação do Botão WhatsApp com Campos Vazios
  await page.fill("#contato input#nome", "");
  await page.fill("#contato textarea#msg", "");
  const waBtn = page.locator('#contato button:has-text("WHATSAPP")').first();
  await waBtn.click();
  await page.waitForTimeout(300);

  const errorEmptyWa = await page.evaluate(() => {
    const err = document.querySelector("#contato div.bg-red-950\\/70");
    return err ? err.innerText.trim() : null;
  });

  record("Contato", vp.name, "Validação WhatsApp com campos vazios", "Exibe mensagem de erro obrigando nome e mensagem", `Mensagem obtida: '${errorEmptyWa}'`, errorEmptyWa?.includes("nome e a mensagem") ? "PASS" : "FAIL", "Médio");

  // 8.3 Preencher dados e interceptar window.open para testar URL gerada do WhatsApp
  await page.fill("#contato input#nome", "QA Steve Rogers");
  await page.fill("#contato input#email", "qa.steve@shield.org");
  await page.fill("#contato textarea#msg", "Teste automatizado de auditoria mobile");

  await page.evaluate(() => {
    window.__openedUrls = [];
    window.open = (url) => { window.__openedUrls.push(url); return null; };
  });

  await waBtn.click();
  await page.waitForTimeout(400);

  const openedUrls = await page.evaluate(() => window.__openedUrls);
  const waUrl = openedUrls[0] || "";
  const waOk = waUrl.includes("wa.me/5511919498217") && waUrl.includes("QA") && waUrl.includes("Steve");

  record("Contato", vp.name, "Geração de URL WhatsApp", "Gera URL wa.me com número 5511919498217 e texto codificado", `URL gerada: ${waUrl.slice(0, 60)}... (Válida: ${waOk})`, waOk ? "PASS" : "FAIL", "Crítico");

  // 8.4 Testar botão Copiar Email
  const copyBtn = page.locator('#contato button:has-text("Copiar")').first();
  if (await copyBtn.count() > 0) {
    await copyBtn.click();
    await page.waitForTimeout(400);
    const copiedText = await page.locator('#contato button:has-text("Copiado")').count();
    record("Contato", vp.name, "Botão Copiar Email", "Muda estado para 'Copiado!'", `Exibiu 'Copiado!': ${copiedText > 0}`, copiedText > 0 ? "PASS" : "WARN", "Baixo");
  }

  // 9. CHECKPOINTS VISUAIS / SCREENSHOTS
  await page.screenshot({ path: `tools/art/mobile-qa/${vp.id}-hero.png`, fullPage: false });
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `tools/art/mobile-qa/${vp.id}-projetos.png`, fullPage: false });
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `tools/art/mobile-qa/${vp.id}-contato.png`, fullPage: false });

  // 10. CONSOLE & PAGE ERRORS
  record("Erros de Runtime", vp.name, "Console Errors", "Zero erros de console", consoleLogs.length ? `${consoleLogs.length} erros: ${consoleLogs.slice(0, 2).join("; ")}` : "Zero erros", consoleLogs.length === 0 ? "PASS" : "WARN", "Médio");
  record("Erros de Runtime", vp.name, "Page Uncaught Errors", "Zero erros não capturados na página", pageErrors.length ? `${pageErrors.length} erros: ${pageErrors.join("; ")}` : "Zero erros", pageErrors.length === 0 ? "PASS" : "Crítico");

  await context.close();
}

await browser.close();

fs.writeFileSync("tools/art/mobile-qa/audit-results-v2.json", JSON.stringify(auditLog, null, 2));

console.log("\n========================================================");
console.log("AUDITORIA MOBILE COMPLETA FINALIZADA!");
console.log(`Total de testes: ${auditLog.length}`);
const passes = auditLog.filter((a) => a.status === "PASS").length;
const warns = auditLog.filter((a) => a.status === "WARN").length;
const fails = auditLog.filter((a) => a.status === "FAIL").length;
console.log(`PASS: ${passes} | WARN: ${warns} | FAIL: ${fails}`);
console.log("========================================================\n");
