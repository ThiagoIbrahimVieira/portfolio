import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function homologateDesktop() {
  console.log("=== INICIANDO HOMOLOGAÇÃO COMPLETA OPERAÇÃO DESKTOP MOTION FIX ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const desktopViewports = [
    { name: "1920x1080", width: 1920, height: 1080 },
    { name: "1440x900", width: 1440, height: 900 },
    { name: "1366x768", width: 1366, height: 768 },
  ];

  const report = {
    heroTimelineSamples: [],
    desktopProofs: {},
    mobileRegression: null,
    consoleErrors: [],
  };

  // 1. Executa homologação em cada viewport Desktop
  for (const vp of desktopViewports) {
    console.log(`\n================================================================`);
    console.log(`>>> HOMOLOGANDO DESKTOP: ${vp.name} (${vp.width}x${vp.height}) <<<`);
    console.log(`================================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: false,
      hasTouch: false,
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") report.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      report.consoleErrors.push(`[${vp.name} PAGEERROR] ${err.message}`);
    });

    console.log("Acessando http://localhost:3005/ ...");
    await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });

    // PROVA 01 — HERO AMOSTRAMEM TEMPORAL (apenas no 1440x900 para métricas)
    if (vp.name === "1440x900") {
      console.log("\n--- [PROVA 01] Amostragem da Hero Master Timeline em Execução ---");
      // Recarrega e mede nos intervalos de tempo da animação
      await page.goto("http://localhost:3005/", { waitUntil: "domcontentloaded" });
      const timePoints = [50, 250, 600, 1200];
      for (const t of timePoints) {
        await page.waitForTimeout(t === 50 ? 50 : t - (timePoints[timePoints.indexOf(t) - 1] || 0));
        const sample = await page.evaluate((currT) => {
          const lines = Array.from(document.querySelectorAll(".hero-title-line"));
          const photo = document.querySelector(".hero-sticker-float");
          const badges = Array.from(document.querySelectorAll(".hero-badge"));
          const ctas = document.querySelector(".hero-cta");

          return {
            timeMs: currT,
            titleLine0Opacity: lines[0] ? window.getComputedStyle(lines[0]).opacity : "N/A",
            titleLine0Transform: lines[0] ? window.getComputedStyle(lines[0]).transform : "N/A",
            photoOpacity: photo ? window.getComputedStyle(photo.closest("[class*='hero-sticker']") || photo).opacity : "N/A",
            badgesAvgOpacity: badges.length > 0 ? (badges.reduce((acc, b) => acc + parseFloat(window.getComputedStyle(b).opacity), 0) / badges.length).toFixed(2) : "N/A",
            ctaOpacity: ctas ? window.getComputedStyle(ctas).opacity : "N/A",
          };
        }, t);
        report.heroTimelineSamples.push(sample);
        console.log(`Frame t=${t}ms:`, sample);
      }
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
    } else {
      await page.waitForTimeout(600);
    }

    // Screenshot do Hero
    await page.screenshot({ path: `tools/art/desktop-${vp.name}-hero.png` });
    console.log(`✓ Screenshot Hero salvo: tools/art/desktop-${vp.name}-hero.png`);

    // PROVA 02 — CARDS NUCLEARES & HOVER 3D
    console.log("\n--- [PROVA 02] Homologação dos Cards Nucleares e Hover 3D ---");
    await page.evaluate(() => {
      const el = document.getElementById("projetos");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
    await page.waitForTimeout(900);

    const cardsCheck = await page.evaluate(() => {
      const desktopCards = Array.from(document.querySelectorAll("[id^='project-desktop-']"));
      const mobileCards = Array.from(document.querySelectorAll("[id^='project-mobile-']"));
      const h2 = document.getElementById("projetos-heading");
      return {
        desktopCardsFound: desktopCards.length,
        mobileCardsFound: mobileCards.length,
        h2Opacity: h2 ? window.getComputedStyle(h2.parentElement?.parentElement || h2).opacity : "N/A",
        desktopCardsState: desktopCards.map((c) => ({
          id: c.id,
          opacity: window.getComputedStyle(c.closest("[style*='opacity']") || c).opacity,
          transform: window.getComputedStyle(c).transform,
          hasImage: !!c.querySelector("img"),
        })),
      };
    });
    console.log(`Cards Check (${vp.name}):`, cardsCheck);
    await page.screenshot({ path: `tools/art/desktop-${vp.name}-cards-grid.png` });
    if (vp.name === "1440x900") {
      await page.screenshot({ path: `tools/art/desktop-cards-grid.png` });
    }

    // Testar Hover 3D no Card Desktop CodeAtlas
    const cardDesktop = await page.$("#project-desktop-codeatlas");
    let hoverResult = { tested: false };
    if (cardDesktop) {
      const beforeHover = await page.evaluate(() => {
        const el = document.querySelector("#project-desktop-codeatlas");
        return el ? window.getComputedStyle(el).transform : null;
      });
      await cardDesktop.hover();
      await page.waitForTimeout(300);
      const afterHover = await page.evaluate(() => {
        const el = document.querySelector("#project-desktop-codeatlas");
        return el ? window.getComputedStyle(el).transform : null;
      });
      hoverResult = {
        tested: true,
        beforeHover,
        afterHover,
        active3D: afterHover && afterHover.includes("matrix3d") || afterHover !== beforeHover,
      };
      console.log(`Hover 3D (${vp.name}):`, hoverResult);
      await page.screenshot({ path: `tools/art/desktop-${vp.name}-card-hover.png` });
      if (vp.name === "1440x900") {
        await page.screenshot({ path: `tools/art/desktop-card-hover.png` });
      }
    }

    // PROVA 03 — DEMAIS SEÇÕES
    console.log("\n--- [PROVA 03] Homologação das Demais Seções ---");
    const sections = ["arsenal", "jornada", "principios", "contato"];
    const sectionsStatus = {};
    for (const id of sections) {
      await page.evaluate((secId) => {
        const el = document.getElementById(secId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, id);
      await page.waitForTimeout(600);

      const secData = await page.evaluate((secId) => {
        const sec = document.getElementById(secId);
        if (!sec) return { found: false };
        const keyEls = Array.from(sec.querySelectorAll("h2, h3, article, li, figure, form"));
        const zeros = keyEls.filter((e) => window.getComputedStyle(e).opacity === "0");
        return {
          found: true,
          total: keyEls.length,
          zeros: zeros.length,
          h2Opacity: sec.querySelector("h2") ? window.getComputedStyle(sec.querySelector("h2")).opacity : "N/A",
        };
      }, id);
      sectionsStatus[id] = secData;
    }
    console.log(`Status Seções (${vp.name}):`, sectionsStatus);
    await page.screenshot({ path: `tools/art/desktop-${vp.name}-sections.png` });
    if (vp.name === "1440x900") {
      await page.screenshot({ path: "tools/art/desktop-sections.png" });
    }

    report.desktopProofs[vp.name] = {
      cardsCheck,
      hoverResult,
      sectionsStatus,
    };

    await context.close();
  }

  // 2. TESTE DE REGRESSÃO MOBILE (390 × 844)
  console.log(`\n================================================================`);
  console.log(`>>> TESTE DE REGRESSÃO MOBILE: iPhone 14 (390x844) <<<`);
  console.log(`================================================================`);
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on("console", (msg) => {
    if (msg.type() === "error") report.consoleErrors.push(`[Mobile] ${msg.text()}`);
  });

  await mobilePage.goto("http://localhost:3005/", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(500);

  const mobileCheck = await mobilePage.evaluate(() => {
    const mobileCarousel = document.querySelector(".snap-x");
    const mobileCards = Array.from(document.querySelectorAll("[id^='project-mobile-']"));
    const desktopCards = Array.from(document.querySelectorAll("[id^='project-desktop-']"));

    return {
      overflowX: document.body.scrollWidth > window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth,
      windowInnerWidth: window.innerWidth,
      carouselExists: !!mobileCarousel,
      mobileCardsCount: mobileCards.length,
      desktopCardsVisible: desktopCards.filter((c) => window.getComputedStyle(c).display !== "none").length,
    };
  });
  console.log("Mobile Check Result:", mobileCheck);
  report.mobileRegression = mobileCheck;
  await mobilePage.screenshot({ path: "tools/art/regression-mobile-390.png" });
  console.log("✓ Screenshot Mobile salvo: tools/art/regression-mobile-390.png");

  await mobileContext.close();
  await browser.close();

  console.log("\n================================================================");
  console.log("RELATÓRIO FINAL DE HOMOLOGAÇÃO:");
  console.log(JSON.stringify(report, null, 2));
  console.log("================================================================");
}

homologateDesktop().catch(console.error);
