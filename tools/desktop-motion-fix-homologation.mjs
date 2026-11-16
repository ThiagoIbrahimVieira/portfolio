import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function runHomologation() {
  console.log("=== INICIANDO SUÍTE OFICIAL DE HOMOLOGAÇÃO QA // OPERAÇÃO DESKTOP MOTION FIX ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const BASE_URL = "http://localhost:3005/";
  const report = {
    heroTimelineSamples: [],
    desktopViewports: {},
    cardsStaggerAndHover: null,
    sectionsZeroOpacity: {},
    consoleErrors: [],
    mobileRegression: null,
  };

  const desktopViewports = [
    { name: "1920x1080", width: 1920, height: 1080, file: "desktop-1920x1080-hero.png" },
    { name: "1440x900", width: 1440, height: 900, file: "desktop-1440x900-hero.png" },
    { name: "1366x768", width: 1366, height: 768, file: "desktop-1366x768-hero.png" },
  ];

  // =========================================================================
  // 1. PROVA 01 — HERO TIMELINE (Amostragem em t=50ms, t=250ms, t=600ms, t=1200ms)
  // =========================================================================
  console.log("\n=======================================================");
  console.log(">>> [PROVA 01] HERO TIMELINE & AMOSTRAGEM TEMPORAL <<<");
  console.log("=======================================================");

  const heroContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
  });
  const heroPage = await heroContext.newPage();
  heroPage.on("console", (m) => {
    if (m.type() === "error") report.consoleErrors.push(`[Console Error] ${m.text()}`);
  });
  heroPage.on("pageerror", (e) => {
    report.consoleErrors.push(`[PageError] ${e.message}`);
  });

  await heroPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  const sampleIntervals = [50, 250, 600, 1200];
  let accumulatedTime = 0;

  for (const targetTime of sampleIntervals) {
    const delta = targetTime - accumulatedTime;
    if (delta > 0) {
      await heroPage.waitForTimeout(delta);
      accumulatedTime = targetTime;
    }

    const frame = await heroPage.evaluate((t) => {
      const h1 = document.querySelector("#hero-heading");
      const lines = Array.from(document.querySelectorAll(".hero-title-line"));
      const badges = Array.from(document.querySelectorAll(".badge-sticker"));
      const photo = document.querySelector(".sticker-die-cut");
      const photoFloat = document.querySelector(".hero-sticker-float");
      const ctas = document.querySelector("a[href='#projetos']");
      const sub = document.querySelector("section#hero p");

      return {
        timeMs: t,
        lines: lines.map((l) => ({
          text: l.innerText.trim(),
          opacity: window.getComputedStyle(l).opacity,
          transform: window.getComputedStyle(l).transform,
        })),
        photoOpacity: photo ? window.getComputedStyle(photo.closest("[style*='opacity']") || photo).opacity : null,
        photoTransform: photoFloat ? window.getComputedStyle(photoFloat).transform : null,
        badgesCount: badges.length,
        badgesOpacities: badges.slice(0, 4).map((b) => window.getComputedStyle(b.closest("[style*='opacity']") || b).opacity),
        subOpacity: sub ? window.getComputedStyle(sub.closest("[style*='opacity']") || sub).opacity : null,
        ctaOpacity: ctas ? window.getComputedStyle(ctas.closest("[style*='opacity']") || ctas).opacity : null,
      };
    }, targetTime);

    report.heroTimelineSamples.push(frame);
    console.log(`Frame t=${targetTime}ms:`, JSON.stringify(frame, null, 2));
  }
  await heroContext.close();

  // Captura screenshots do Hero nas 3 viewports obrigatórias
  for (const vp of desktopViewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: false,
      hasTouch: false,
      deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    p.on("console", (m) => {
      if (m.type() === "error") report.consoleErrors.push(`[${vp.name} Error] ${m.text()}`);
    });
    p.on("pageerror", (e) => {
      report.consoleErrors.push(`[${vp.name} PageError] ${e.message}`);
    });

    await p.goto(BASE_URL, { waitUntil: "networkidle" });
    await p.waitForTimeout(1400); // espera finalização completa da timeline

    await p.screenshot({ path: `tools/art/${vp.file}` });
    console.log(`✓ Screenshot salvo: tools/art/${vp.file}`);

    const state = await p.evaluate(() => {
      const h1 = document.querySelector("#hero-heading");
      const lines = Array.from(document.querySelectorAll(".hero-title-line"));
      const photo = document.querySelector(".sticker-die-cut");
      const ctas = document.querySelector("a[href='#projetos']");
      return {
        linesAllVisible: lines.every((l) => window.getComputedStyle(l).opacity === "1"),
        photoVisible: photo ? window.getComputedStyle(photo.closest("[style*='opacity']") || photo).opacity === "1" : false,
        ctasVisible: ctas ? window.getComputedStyle(ctas.closest("[style*='opacity']") || ctas).opacity === "1" : false,
      };
    });
    report.desktopViewports[vp.name] = state;
    await ctx.close();
  }

  // =========================================================================
  // 2. PROVA 02 — CARDS NUCLEARES: STAGGER E HOVER 3D NO DESKTOP
  // =========================================================================
  console.log("\n=======================================================");
  console.log(">>> [PROVA 02] CARDS NUCLEARES: STAGGER E HOVER 3D <<<");
  console.log("=======================================================");

  const cardsCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
  });
  const cardsPage = await cardsCtx.newPage();
  cardsPage.on("console", (m) => {
    if (m.type() === "error") report.consoleErrors.push(`[Cards Error] ${m.text()}`);
  });
  cardsPage.on("pageerror", (e) => {
    report.consoleErrors.push(`[Cards PageError] ${e.message}`);
  });

  await cardsPage.goto(BASE_URL, { waitUntil: "networkidle" });
  await cardsPage.waitForTimeout(500);

  // Rola até #projetos
  await cardsPage.evaluate(() => {
    const el = document.getElementById("projetos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await cardsPage.waitForTimeout(800);

  // Screenshot grid de cards
  await cardsPage.screenshot({ path: "tools/art/desktop-cards-grid.png" });
  console.log("✓ Screenshot salvo: tools/art/desktop-cards-grid.png");

  // Auditoria dos cards nucleares
  const cardsAudit = await cardsPage.evaluate(() => {
    const sec = document.getElementById("projetos");
    const articles = Array.from(sec ? sec.querySelectorAll("article") : []);
    return articles.map((a) => {
      const title = a.querySelector("h3")?.innerText || a.querySelector("h4")?.innerText || a.id;
      const comp = window.getComputedStyle(a);
      const parentComp = window.getComputedStyle(a.closest("[style*='opacity']") || a);
      return {
        id: a.id,
        title,
        opacity: parentComp.opacity,
        visibility: comp.visibility,
        transform: comp.transform,
      };
    });
  });

  // Microinteração de Hover no card CodeAtlas
  const cardSelector = "#project-codeatlas";
  const cardLocator = cardsPage.locator(cardSelector);
  let hoverData = null;

  if (await cardLocator.count() > 0) {
    const beforeHoverTransform = await cardsPage.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? window.getComputedStyle(el).transform : null;
    }, cardSelector);

    // Hover no quadrante superior direito para induzir rotação 3D clara
    const box = await cardLocator.boundingBox();
    if (box) {
      await cardsPage.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
      await cardsPage.waitForTimeout(300);

      const onHoverTransform = await cardsPage.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).transform : null;
      }, cardSelector);

      await cardsPage.screenshot({ path: "tools/art/desktop-card-hover.png" });
      console.log("✓ Screenshot salvo: tools/art/desktop-card-hover.png");

      // Tira o mouse para verificar retorno ao repouso
      await cardsPage.mouse.move(0, 0);
      await cardsPage.waitForTimeout(500);

      const afterHoverTransform = await cardsPage.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).transform : null;
      }, cardSelector);

      hoverData = {
        beforeHoverTransform,
        onHoverTransform,
        afterHoverTransform,
        interactive: onHoverTransform !== beforeHoverTransform,
        returnedToRest: afterHoverTransform === beforeHoverTransform || afterHoverTransform === "none" || afterHoverTransform.includes("1, 0, 0, 1, 0, 0"),
      };
    }
  }

  report.cardsStaggerAndHover = {
    cards: cardsAudit,
    hover: hoverData,
  };
  console.log("Cards Stagger & Hover Result:", JSON.stringify(report.cardsStaggerAndHover, null, 2));

  // =========================================================================
  // 3. PROVA 03 — SEÇÕES RESTANTES (#arsenal, #jornada, #principios, #contato)
  // =========================================================================
  console.log("\n=======================================================");
  console.log(">>> [PROVA 03] SEÇÕES RESTANTES — ZERO OPACITY 0 <<<");
  console.log("=======================================================");

  const sectionsToAudit = ["arsenal", "jornada", "principios", "contato"];
  for (const sId of sectionsToAudit) {
    await cardsPage.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, sId);
    await cardsPage.waitForTimeout(800);

    const sAudit = await cardsPage.evaluate((id) => {
      const sec = document.getElementById(id);
      if (!sec) return { found: false };
      const keyNodes = Array.from(sec.querySelectorAll("h2, h3, article, li, figure, form, button, p"));
      const opacities = keyNodes.map((n) => parseFloat(window.getComputedStyle(n).opacity));
      const zeroCount = opacities.filter((o) => o === 0).length;
      return {
        found: true,
        totalNodes: keyNodes.length,
        zeroCount,
        allVisible: zeroCount === 0,
      };
    });

    report.sectionsZeroOpacity[sId] = sAudit;
    console.log(`Seção #${sId}:`, sAudit);
  }

  // Screenshot de seções consolidadas
  await cardsPage.screenshot({ path: "tools/art/desktop-sections.png" });
  console.log("✓ Screenshot salvo: tools/art/desktop-sections.png");
  await cardsCtx.close();

  // =========================================================================
  // 4. REGRESSÃO MOBILE (390 × 844 — iPhone 14)
  // =========================================================================
  console.log("\n=======================================================");
  console.log(">>> [REGRESSÃO MOBILE] 390 × 844 (iPhone 14) <<<");
  console.log("=======================================================");

  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  const mobPage = await mobCtx.newPage();
  mobPage.on("console", (m) => {
    if (m.type() === "error") report.consoleErrors.push(`[Mobile Error] ${m.text()}`);
  });
  mobPage.on("pageerror", (e) => {
    report.consoleErrors.push(`[Mobile PageError] ${e.message}`);
  });

  await mobPage.goto(BASE_URL, { waitUntil: "networkidle" });
  await mobPage.waitForTimeout(1000);

  // Scroll progressivo mobile para testar snap carousels e overflow em toda extensão
  for (let y = 0; y <= 6000; y += 600) {
    await mobPage.evaluate((pos) => window.scrollTo(0, pos), y);
    await mobPage.waitForTimeout(80);
  }
  await mobPage.waitForTimeout(500);

  const mobAudit = await mobPage.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    const bodyW = document.body.scrollWidth;
    const maxW = Math.max(scrollW, bodyW);
    const overflowDiff = maxW - docW;

    // Verifica se os carrosséis snap existem e estão íntegros
    const carousels = Array.from(document.querySelectorAll(".snap-x, [class*='snap-']"));

    return {
      viewportWidth: docW,
      scrollWidth: maxW,
      overflowDiff,
      hasOverflow: overflowDiff > 1,
      carouselsCount: carousels.length,
      allCarouselsFound: carousels.length >= 2,
    };
  });

  report.mobileRegression = mobAudit;
  console.log("Auditoria Mobile 390x844:", JSON.stringify(mobAudit, null, 2));

  await mobPage.screenshot({ path: "tools/art/regression-mobile-390.png" });
  console.log("✓ Screenshot salvo: tools/art/regression-mobile-390.png");

  await mobCtx.close();
  await browser.close();

  console.log("\n=======================================================");
  console.log(">>> RESUMO DE CONSOLE ERRORS <<<");
  console.log(`Total de erros capturados: ${report.consoleErrors.length}`);
  if (report.consoleErrors.length > 0) {
    console.log(report.consoleErrors);
  }

  return report;
}

runHomologation()
  .then((res) => {
    const isPass =
      res.consoleErrors.length === 0 &&
      !res.mobileRegression.hasOverflow &&
      Object.values(res.sectionsZeroOpacity).every((s) => s.allVisible) &&
      res.cardsStaggerAndHover?.hover?.interactive;

    console.log(`\n=======================================================`);
    console.log(`VEREDITO FINAL DA HOMOLOGAÇÃO: ${isPass ? "HOMOLOGADO (QA PASS)" : "REPROVADO (QA VETO)"}`);
    console.log(`=======================================================`);
  })
  .catch(console.error);
