import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function testDesktopLive() {
  console.log("=== INICIANDO AUDITORIA TÉCNICA DESKTOP REAL PLAYWRIGHT ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const viewports = [
    { name: "1920x1080", width: 1920, height: 1080 },
    { name: "1440x900", width: 1440, height: 900 },
    { name: "1366x768", width: 1366, height: 768 },
  ];

  for (const vp of viewports) {
    console.log(`\n================================================================`);
    console.log(`>>> VIEWPORT DESKTOP: ${vp.name} (${vp.width}x${vp.height}, isMobile: false, hasTouch: false) <<<`);
    console.log(`================================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: false,
      hasTouch: false,
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();
    const consoleLogs = [];
    page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
    page.on("pageerror", (err) => consoleLogs.push(`[PAGEERROR] ${err.message}`));

    console.log("Acessando http://localhost:3005/ (aguardando networkidle para hidratação total)...");
    await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    // 1. PROVA 01 — HERO AUDIT: Capturar estado visual e métricas de animação
    console.log("\n--- [PROVA 01] Auditoria de Animação do Hero ---");
    const heroAudit = await page.evaluate(() => {
      const h1 = document.querySelector("#hero-heading");
      const titleLines = Array.from(document.querySelectorAll(".hero-title-line"));
      const photoCard = document.querySelector(".hero-sticker-float");
      const badges = Array.from(document.querySelectorAll(".badge-sticker"));
      const ctas = document.querySelector("a[href='#projetos']");

      return {
        h1Found: !!h1,
        titleLines: titleLines.map((l) => ({
          text: l.innerText,
          transform: window.getComputedStyle(l).transform,
          opacity: window.getComputedStyle(l).opacity,
        })),
        photoTransform: photoCard ? window.getComputedStyle(photoCard).transform : null,
        photoOpacity: photoCard ? window.getComputedStyle(photoCard.parentElement?.parentElement || photoCard).opacity : null,
        badgesCount: badges.length,
        badgesSample: badges.slice(0, 4).map((b) => ({
          text: b.innerText,
          opacity: window.getComputedStyle(b.parentElement?.parentElement || b).opacity,
          transform: window.getComputedStyle(b).transform,
        })),
        ctaOpacity: ctas ? window.getComputedStyle(ctas.parentElement?.parentElement || ctas).opacity : null,
      };
    });
    console.log("Hero Audit Result:", JSON.stringify(heroAudit, null, 2));
    await page.screenshot({ path: `tools/art/desktop-${vp.name}-01-hero.png` });
    console.log(`✓ Screenshot Hero salvo: tools/art/desktop-${vp.name}-01-hero.png`);

    // 2. PROVA 02 — CARDS AUDIT: Rolar até projetos nucleares, verificar revelação e hover
    console.log("\n--- [PROVA 02] Auditoria dos Cards Nucleares ---");
    await page.evaluate(() => {
      const el = document.getElementById("projetos");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
    await page.waitForTimeout(800);

    const cardsAudit = await page.evaluate(() => {
      const sec = document.getElementById("projetos");
      const h2 = document.getElementById("projetos-heading");
      const articles = Array.from(sec ? sec.querySelectorAll("article") : []);
      return {
        sectionFound: !!sec,
        h2Opacity: h2 ? window.getComputedStyle(h2.parentElement?.parentElement || h2).opacity : null,
        cardsCount: articles.length,
        cardsState: articles.slice(0, 4).map((a) => ({
          id: a.id,
          opacity: window.getComputedStyle(a.closest("[style*='opacity']") || a).opacity,
          transform: window.getComputedStyle(a).transform,
          hasImage: !!a.querySelector("img"),
        })),
      };
    });
    console.log("Cards Audit Result:", JSON.stringify(cardsAudit, null, 2));
    await page.screenshot({ path: `tools/art/desktop-${vp.name}-02-cards.png` });

    // Testar Hover 3D no primeiro Card
    const cardEl = await page.$("#project-codeatlas");
    if (cardEl) {
      console.log("Testando microinteração de hover no Card CodeAtlas...");
      const beforeHover = await page.evaluate(() => {
        const el = document.querySelector("#project-codeatlas");
        return el ? window.getComputedStyle(el).transform : null;
      });
      await cardEl.hover();
      await page.waitForTimeout(250);
      const afterHover = await page.evaluate(() => {
        const el = document.querySelector("#project-codeatlas");
        return el ? window.getComputedStyle(el).transform : null;
      });
      console.log("Hover 3D Result:", {
        beforeHover,
        afterHover,
        interactive: beforeHover !== afterHover,
      });
      await page.screenshot({ path: `tools/art/desktop-${vp.name}-02-card-hover.png` });
    }

    // 3. PROVA 03 — DEMAIS SEÇÕES: Rolar por cada seção e comprovar visibilidade e animação
    const otherSections = ["arsenal", "jornada", "principios", "contato"];
    for (const secId of otherSections) {
      console.log(`\n--- [PROVA 03] Verificando Seção #${secId} ---`);
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, secId);
      await page.waitForTimeout(700);

      const status = await page.evaluate((id) => {
        const sec = document.getElementById(id);
        if (!sec) return { found: false };
        const keyElements = Array.from(sec.querySelectorAll("h2, h3, article, li, figure, form"));
        const opacities = keyElements.map((el) => window.getComputedStyle(el).opacity);
        const zeroCount = opacities.filter((o) => o === "0").length;
        return {
          found: true,
          elementsCount: keyElements.length,
          zeroOpacityCount: zeroCount,
          h2Opacity: sec.querySelector("h2") ? window.getComputedStyle(sec.querySelector("h2")).opacity : null,
        };
      });
      console.log(`Status #${secId}:`, status);
      await page.screenshot({ path: `tools/art/desktop-${vp.name}-03-${secId}.png` });
    }

    console.log("Erros no Console:", consoleLogs.filter((l) => l.includes("error") || l.includes("PAGEERROR")));
    await context.close();
  }

  await browser.close();
  console.log("\n=== AUDITORIA TÉCNICA DESKTOP REAL CONCLUÍDA ===");
}

testDesktopLive().catch(console.error);
