import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function verifyFix() {
  console.log("=== INICIANDO VALIDAÇÃO DO FIX DE ANIMAÇÕES & RESILIÊNCIA ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const baseUrl = "http://localhost:3005/";
  console.log("Navegando para", baseUrl);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // 1. Initial State Check (Hero should be visible, others should be ready)
  const heroStatus = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      h1Text: h1?.innerText,
      h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
      badges: Array.from(document.querySelectorAll(".badge-sticker")).map((b) => ({
        text: b.innerText,
        opacity: window.getComputedStyle(b.parentElement || b).opacity,
      })),
    };
  });
  console.log("Hero & Badges Status:", JSON.stringify(heroStatus, null, 2));

  // 2. Test Section Navigation (Navbar links)
  const sections = ["projetos", "arsenal", "jornada", "principios", "contato"];
  for (const id of sections) {
    console.log(`\n--- Testando navegação direta para #${id} ---`);
    await page.evaluate((secId) => {
      const el = document.getElementById(secId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, id);
    await page.waitForTimeout(700);

    const secStatus = await page.evaluate((secId) => {
      const sec = document.getElementById(secId);
      if (!sec) return { found: false };
      const elements = Array.from(sec.querySelectorAll("h2, h3, article, figure, form, li"));
      const zeroOpacities = elements.filter((el) => window.getComputedStyle(el).opacity === "0");
      return {
        found: true,
        totalChecked: elements.length,
        zeroOpacitiesCount: zeroOpacities.length,
        isH2Visible: sec.querySelector("h2") ? window.getComputedStyle(sec.querySelector("h2")).opacity : "N/A",
      };
    }, id);
    console.log(`Status de #${id}:`, secStatus);
    await page.screenshot({ path: `tools/art/fix-section-${id}.png` });
  }

  // 3. Test Full Page Scroll and Final State
  console.log("\n--- Rolando página inteira e verificando opacidades finais ---");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < totalHeight; y += 450) {
    await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: "smooth" }), y);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(800);

  const fullAudit = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("h1, h2, h3, article, p, button, a, figure, li"));
    const zeros = all.filter((el) => {
      const s = window.getComputedStyle(el);
      return s.opacity === "0" && el.offsetWidth > 0 && el.offsetHeight > 0;
    });
    return {
      totalElements: all.length,
      zeroOpacityCount: zeros.length,
      bodyOverflowX: document.body.scrollWidth > window.innerWidth,
    };
  });
  console.log("Auditoria Geral Desktop:", fullAudit);
  await page.screenshot({ path: "tools/art/fix-fullpage-desktop.png", fullPage: true });

  // 4. Test Mobile Viewport (390x844)
  console.log("\n--- Testando Viewport Mobile (390x844) ---");
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(500);

  const mobileAudit = await mobilePage.evaluate(() => ({
    bodyOverflowX: document.body.scrollWidth > window.innerWidth,
    scrollWidth: document.body.scrollWidth,
    clientWidth: window.innerWidth,
  }));
  console.log("Auditoria Mobile Overflow:", mobileAudit);
  await mobilePage.screenshot({ path: "tools/art/fix-mobile-hero.png" });

  console.log("\nConsole Errors:", consoleErrors.length === 0 ? "0 ERROS (LIMPO)" : consoleErrors);
  await browser.close();
  console.log("=== VALIDAÇÃO CONCLUÍDA COM SUCESSO ===");
}

verifyFix().catch(console.error);
