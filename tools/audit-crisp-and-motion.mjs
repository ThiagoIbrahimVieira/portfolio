import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function runAudit() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = {
    blurAudit: null,
    animationAudit: null,
    reducedMotionAudit: null,
    responsivenessAudit: {},
  };

  console.log("=== INICIANDO AUDITORIA CRISP & MOTION EM PRODUÇÃO ===");
  const targetUrl = "https://portifolio-thiago-ibrahim.vercel.app/";

  // ----------------------------------------------------------------------
  // 1. AUDITORIA DE NITIDEZ (ZERO BLUR) EM DESKTOP (1440x900)
  // ----------------------------------------------------------------------
  console.log("\n--- 1. Auditoria de Nitidez (Zero Blur) ---");
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Rola gradualmente para ativar os observers de todas as seções
  for (let y = 0; y <= 6000; y += 800) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const blurAudit = await page.evaluate(() => {
    // 6 títulos essenciais
    const titlesToCheck = [
      { name: "Hero H1 (THIAGO IBRAHIM)", selector: "#hero-heading" },
      { name: "Projetos Nucleares H2", text: "PROJETOS NUCLEARES" },
      { name: "Projetos de Suporte H3", text: "PROJETOS DE SUPORTE" },
      { name: "Arsenal H2", text: "ARSENAL TÉCNICO" },
      { name: "Jornada H2", text: "JORNADA DE ENGENHARIA" },
      { name: "Princípios H2", text: "PRINCÍPIOS DE CONSTRUÇÃO" },
    ];

    const headingsData = titlesToCheck.map((item) => {
      let el = item.selector
        ? document.querySelector(item.selector)
        : Array.from(document.querySelectorAll("h1, h2, h3")).find((h) =>
            h.innerText.includes(item.text)
          );

      const computed = el ? window.getComputedStyle(el) : null;
      const parent = el?.closest("div");
      const parentComputed = parent ? window.getComputedStyle(parent) : null;

      return {
        name: item.name,
        found: !!el,
        elementFilter: computed?.filter || "not-found",
        parentFilter: parentComputed?.filter || "none",
        elementOpacity: computed?.opacity || "0",
        pass:
          computed?.filter === "none" &&
          (parentComputed?.filter === "none" || !parentComputed?.filter),
      };
    });

    // Auditoria específica dos cards de suporte
    const supportSection = Array.from(document.querySelectorAll("h3")).find(
      (h) => h.innerText.includes("PROJETOS DE SUPORTE")
    );
    const supportContainer = supportSection?.closest("div.mt-20");
    const supportCards = ["spacesweep", "nordicos-tattoo", "segundo-cerebro"].map(
      (id) => {
        const card = document.getElementById(`project-${id}`);
        const cStyle = card ? window.getComputedStyle(card) : null;
        return {
          id,
          found: !!card,
          filter: cStyle?.filter,
          opacity: cStyle?.opacity,
          visibility: cStyle?.visibility,
          pass: cStyle?.filter === "none" && cStyle?.opacity === "1",
        };
      }
    );

    return {
      headings: headingsData,
      supportContainerFilter: supportContainer
        ? window.getComputedStyle(supportContainer).filter
        : "none",
      supportCards,
      allPass:
        headingsData.every((h) => h.pass) &&
        supportCards.every((c) => c.pass),
    };
  });

  results.blurAudit = blurAudit;
  console.log("Status Zero Blur Títulos e Cards:", blurAudit.allPass ? "PASS (100% Nítido)" : "FAIL");

  // ----------------------------------------------------------------------
  // 2. AUDITORIA DE ANIMAÇÃO E REDUCED MOTION
  // ----------------------------------------------------------------------
  console.log("\n--- 2. Auditoria de Animações e Reduced Motion ---");
  // Teste de prefers-reduced-motion
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto(targetUrl, { waitUntil: "networkidle" });
  await rmPage.waitForTimeout(500);

  const reducedMotionAudit = await rmPage.evaluate(() => {
    // No modo reduce, todos os elementos principais devem estar opacos imediatamente
    const sampleElements = [
      document.querySelector("#hero-heading"),
      document.querySelector("div.badge-sticker"),
      document.querySelector("article[id^='project-']"),
    ].filter(Boolean);

    const isAllVisible = sampleElements.every(
      (el) => window.getComputedStyle(el).opacity === "1"
    );

    // Verifica se nenhuma animação infinita pesada ou filtros estão presentes
    const filters = sampleElements.map((el) => window.getComputedStyle(el).filter);

    return {
      allVisible: isAllVisible,
      filtersAreNone: filters.every((f) => f === "none"),
      pass: isAllVisible && filters.every((f) => f === "none"),
    };
  });

  results.reducedMotionAudit = reducedMotionAudit;
  console.log(
    "Status Reduced Motion:",
    reducedMotionAudit.pass ? "PASS (Respeito rigoroso a acessibilidade)" : "FAIL"
  );
  await rmPage.screenshot({ path: "tools/art/crisp-motion-reduced.png" });
  await rmContext.close();

  // ----------------------------------------------------------------------
  // 3. AUDITORIA DE RESPONSIVIDADE E VAZAMENTO (OVERFLOW-X)
  // ----------------------------------------------------------------------
  console.log("\n--- 3. Auditoria de Responsividade e Overflow ---");
  const viewports = [
    { name: "Desktop", width: 1440, height: 900 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Mobile", width: 375, height: 812 },
  ];

  for (const vp of viewports) {
    const vContext = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const vPage = await vContext.newPage();
    await vPage.goto(targetUrl, { waitUntil: "networkidle" });
    await vPage.waitForTimeout(800);

    // Scroll completo para verificar overflow em toda a extensão
    const overflowData = await vPage.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body.scrollWidth;
      const maxW = Math.max(scrollW, bodyScrollW);
      const diff = maxW - docW;

      return {
        clientWidth: docW,
        scrollWidth: maxW,
        overflowDiff: diff,
        hasHorizontalScroll: diff > 1, // tolerância de 1px subpixel
      };
    });

    results.responsivenessAudit[vp.name] = {
      ...overflowData,
      pass: !overflowData.hasHorizontalScroll,
    };

    console.log(
      `Viewport ${vp.name} (${vp.width}x${vp.height}): clientWidth=${overflowData.clientWidth}px, scrollWidth=${overflowData.scrollWidth}px, diff=${overflowData.overflowDiff}px -> ${
        !overflowData.hasHorizontalScroll ? "PASS (0px vazamento)" : "FAIL"
      }`
    );

    await vPage.screenshot({
      path: `tools/art/crisp-motion-${vp.name.toLowerCase()}.png`,
    });
    await vContext.close();
  }

  await page.screenshot({ path: "tools/art/crisp-motion-desktop-full.png", fullPage: true });
  await browser.close();

  console.log("\n=== AUDITORIA FINALIZADA ===");
  return results;
}

runAudit()
  .then((res) => {
    const allPass =
      res.blurAudit.allPass &&
      res.reducedMotionAudit.pass &&
      Object.values(res.responsivenessAudit).every((v) => v.pass);
    console.log(`\nVEREDITO GERAL DA AUDITORIA: ${allPass ? "HOMOLOGADO (QA PASS)" : "REPROVADO (QA VETO)"}`);
  })
  .catch(console.error);
