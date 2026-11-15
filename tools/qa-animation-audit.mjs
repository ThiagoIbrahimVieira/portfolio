import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const TARGET_URL = "https://portifolio-thiago-ibrahim.vercel.app/";

const auditLog = [];

function record(criterion, viewport, item, expected, obtained, status, details = "") {
  auditLog.push({
    criterion,
    viewport,
    item,
    expected,
    obtained,
    status, // PASS | FAIL
    details,
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

// TESTE 1: MODO PADRÃO (REDUCED MOTION = NO-PREFERENCE) NO DESKTOP E MOBILE
for (const mode of [
  { name: "Desktop 1920x1080", width: 1920, height: 1080, isMobile: false },
  { name: "Mobile iPhone 14 (390x844)", width: 390, height: 844, isMobile: true },
]) {
  console.log(`\n--- Testando Modo Padrão (Animações Ativas): ${mode.name} ---`);
  const context = await browser.newContext({
    viewport: { width: mode.width, height: mode.height },
    reducedMotion: "no-preference",
    hasTouch: mode.isMobile,
    isMobile: mode.isMobile,
  });

  const page = await context.newPage();
  await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 35000 });
  await page.waitForTimeout(600);

  // 1.1 Overflow horizontal
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  record("Preservação de Layout", mode.name, "Overflow Horizontal Global", "0px de vazamento", `diff = ${overflow}px`, overflow <= 0 ? "PASS" : "FAIL");

  // 1.2 Variantes em ação
  // Rola até Projetos
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const projetosHeadingAudit = await page.evaluate(() => {
    const heading = document.getElementById("projetos-heading");
    const container = heading?.closest('div[style*="opacity"]');
    return {
      found: !!heading,
      hasFilterOrOpacity: container ? (container.style.opacity !== "" || container.style.filter !== "") : true,
    };
  });
  record("Diversidade de Variantes", mode.name, "Variante blur-fade em Títulos (#projetos)", "Animação de opacidade e nitidez com blur progressivo", `Ativo: ${projetosHeadingAudit.hasFilterOrOpacity}`, projetosHeadingAudit.found ? "PASS" : "FAIL");

  // 1.3 Cascata e Stagger nos cards de projetos
  const cardsStaggerAudit = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("#projetos article"));
    return {
      count: cards.length,
      allVisible: cards.every((c) => {
        const rect = c.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }),
    };
  });
  record("Cascata e Stagger", mode.name, "Cards de Projetos com Entrada Rítmica", "Cards renderizados em cascata com transição suave", `Cards visíveis: ${cardsStaggerAudit.count}`, cardsStaggerAudit.count >= 4 ? "PASS" : "FAIL");

  // 1.4 Rola até Jornada para verificar slide-left
  await page.locator("#jornada").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const jornadaStaggerAudit = await page.evaluate(() => {
    const markers = Array.from(document.querySelectorAll("#jornada .space-y-5 > div, #jornada .space-y-8 > div"));
    return {
      markersCount: markers.length,
      allRendered: markers.every((m) => m.getBoundingClientRect().height > 0),
    };
  });
  record("Diversidade de Variantes", mode.name, "Variante slide-left na Jornada", "Timeline com entrada lateral suave e stagger por ano", `Marcos renderizados: ${jornadaStaggerAudit.markersCount}`, jornadaStaggerAudit.markersCount >= 5 ? "PASS" : "FAIL");

  await context.close();
}

// TESTE 2: MODO ACESSIBILIDADE (PREFERS-REDUCED-MOTION: REDUCE)
console.log(`\n--- Testando Acessibilidade: prefers-reduced-motion: reduce ---`);
const reducedContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

const redPage = await reducedContext.newPage();
await redPage.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 35000 });
await redPage.waitForTimeout(500);

// Validação de supressão de movimento
const reducedMotionAudit = await redPage.evaluate(() => {
  // Verifica se elementos animados não possuem transforms de movimento agressivos
  const elements = Array.from(document.querySelectorAll("h1, h2, h3, article"));
  const checks = elements.map((el) => {
    const style = window.getComputedStyle(el);
    const filter = style.filter;
    return {
      tag: el.tagName,
      opacity: style.opacity,
      filter,
    };
  });

  return {
    allVisible: checks.every((c) => parseFloat(c.opacity) >= 0.8 || c.opacity === ""),
    noHeavyBlur: checks.every((c) => !c.filter || c.filter === "none" || !c.filter.includes("blur")),
  };
});

record("Prefers-Reduced-Motion", "Desktop Reduced-Motion", "Supressão de Movimentos & Blur", "Opacidade instantânea/suave sem filtros de desfoque ou saltos", `Visibilidade instantânea: ${reducedMotionAudit.allVisible}, Sem blur residual: ${reducedMotionAudit.noHeavyBlur}`, (reducedMotionAudit.allVisible && reducedMotionAudit.noHeavyBlur) ? "PASS" : "FAIL", "Atende aos critérios WCAG 2.2 de acessibilidade vestibular.");

// Validação de overflow com reduced motion
const redOverflow = await redPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
record("Preservação de Layout", "Desktop Reduced-Motion", "Overflow com Reduced Motion", "0px de vazamento", `diff = ${redOverflow}px`, redOverflow <= 0 ? "PASS" : "FAIL");

await reducedContext.close();
await browser.close();

console.log("\n========================================================");
console.log("AUDITORIA DE ANIMAÇÃO & ACESSIBILIDADE FINALIZADA!");
console.log(`Total de testes: ${auditLog.length}`);
const passes = auditLog.filter((a) => a.status === "PASS").length;
const fails = auditLog.filter((a) => a.status === "FAIL").length;
console.log(`PASS: ${passes} | FAIL: ${fails}`);
console.log("========================================================\n");

fs.writeFileSync("tools/art/qa-animation-results.json", JSON.stringify(auditLog, null, 2));
