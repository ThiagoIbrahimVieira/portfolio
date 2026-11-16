import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function investigateDesktop() {
  console.log("=== INICIANDO INVESTIGAÇÃO DESKTOP REAL PLAYWRIGHT ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const viewports = [
    { name: "1920x1080", width: 1920, height: 1080 },
    { name: "1440x900", width: 1440, height: 900 },
    { name: "1366x768", width: 1366, height: 768 },
  ];

  for (const vp of viewports) {
    console.log(`\n======================================================`);
    console.log(`>>> TESTANDO VIEWPORT DESKTOP: ${vp.name} (${vp.width}x${vp.height}) <<<`);
    console.log(`======================================================`);

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

    // Inspeciona antes de carregar: instrumenta ScrollTrigger e GSAP no window
    await page.addInitScript(() => {
      window.__animationEvents = [];
    });

    console.log("Acessando http://localhost:3005/ ...");
    await page.goto("http://localhost:3005/", { waitUntil: "domcontentloaded" });

    // 1. Prova Hero - Amostragem temporal da Timeline (t=50ms, t=250ms, t=600ms, t=1200ms)
    console.log("--- Amostragem de Animação do Hero ---");
    for (const waitMs of [50, 200, 400, 600]) {
      await page.waitForTimeout(waitMs);
      const heroFrame = await page.evaluate(() => {
        const h1 = document.querySelector("#hero-heading");
        const lines = Array.from(document.querySelectorAll(".hero-title-line"));
        const photo = document.querySelector(".sticker-die-cut");
        const badges = Array.from(document.querySelectorAll(".badge-sticker"));
        const ctas = document.querySelector("a[href='#projetos']");

        return {
          lines: lines.map((l) => ({
            text: l.innerText,
            transform: window.getComputedStyle(l).transform,
            opacity: window.getComputedStyle(l).opacity,
          })),
          photoTransform: photo ? window.getComputedStyle(photo).transform : null,
          photoOpacity: photo ? window.getComputedStyle(photo.parentElement?.parentElement || photo).opacity : null,
          badgesCount: badges.length,
          badgesOpacities: badges.map((b) => window.getComputedStyle(b.parentElement?.parentElement || b).opacity),
          ctaOpacity: ctas ? window.getComputedStyle(ctas.parentElement?.parentElement || ctas).opacity : null,
        };
      });
      console.log(`Estado Hero após +${waitMs}ms:`, JSON.stringify(heroFrame, null, 2));
    }

    await page.screenshot({ path: `tools/art/desktop-${vp.name}-hero-final.png` });
    console.log(`✓ Screenshot Hero salvo: tools/art/desktop-${vp.name}-hero-final.png`);

    // 2. Diagnóstico de GSAP, ScrollTrigger e Lenis
    const gsapDiag = await page.evaluate(() => {
      const g = window.gsap;
      const st = window.ScrollTrigger;
      const lenis = window.__lenis;
      return {
        hasGsap: !!g,
        hasScrollTrigger: !!st,
        hasLenis: !!lenis,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        bodyScrollHeight: document.body.scrollHeight,
        windowInnerHeight: window.innerHeight,
        allRevealCount: document.querySelectorAll("[class*='RevealSection'], [data-reveal]").length,
      };
    });
    console.log("Diagnóstico GSAP/Lenis/DOM:", gsapDiag);

    // 3. Rolar progressivamente e verificar execução nas seções
    const sections = ["projetos", "arsenal", "jornada", "principios", "contato"];
    for (const secId of sections) {
      console.log(`\nRolando suavemente até #${secId}...`);
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, secId);
      await page.waitForTimeout(600);

      const secStatus = await page.evaluate((id) => {
        const sec = document.getElementById(id);
        if (!sec) return { found: false };
        const elements = Array.from(sec.querySelectorAll("h2, h3, article, li, figure, button"));
        const opacities = elements.map((el) => parseFloat(window.getComputedStyle(el).opacity));
        const zeroCount = opacities.filter((o) => o === 0).length;
        const avgOpacity = opacities.length > 0 ? opacities.reduce((a, b) => a + b, 0) / opacities.length : 0;

        return {
          found: true,
          totalElements: elements.length,
          zeroCount,
          avgOpacity: avgOpacity.toFixed(2),
          rect: sec.getBoundingClientRect(),
        };
      });
      console.log(`Status de #${secId}:`, secStatus);
      await page.screenshot({ path: `tools/art/desktop-${vp.name}-${secId}.png` });
    }

    // 4. Teste de Microinteração e Hover no Desktop (Card e Badge)
    console.log("\n--- Testando Hover em Card de Projeto (Desktop) ---");
    const firstCard = await page.$("#project-codeatlas");
    if (firstCard) {
      const beforeHover = await page.evaluate(() => {
        const el = document.querySelector("#project-codeatlas");
        return el ? window.getComputedStyle(el).transform : null;
      });
      await firstCard.hover();
      await page.waitForTimeout(200);
      const afterHover = await page.evaluate(() => {
        const el = document.querySelector("#project-codeatlas");
        return el ? window.getComputedStyle(el).transform : null;
      });
      console.log("Hover Card CodeAtlas:", { beforeHover, afterHover, changed: beforeHover !== afterHover });
      await page.screenshot({ path: `tools/art/desktop-${vp.name}-card-hover.png` });
    }

    console.log("Console Logs:", consoleLogs.filter((l) => l.includes("error") || l.includes("WARN")));
    await context.close();
  }

  await browser.close();
  console.log("\n=== INVESTIGAÇÃO DESKTOP CONCLUÍDA COM SUCESSO ===");
}

investigateDesktop().catch(console.error);
