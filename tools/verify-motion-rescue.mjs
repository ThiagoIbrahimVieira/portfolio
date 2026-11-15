import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function verifyMotionRescue() {
  console.log("=== INICIANDO HOMOLOGAÇÃO VISUAL PLAYWRIGHT (PORTA 3005) ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const baseUrl = "http://localhost:3005/";

  // 1. Abertura do site
  console.log("Navegando para", baseUrl);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  // Screenshot 1: Hero com Text Mask Reveal
  await page.screenshot({ path: "tools/art/rescue-01-hero.png" });
  console.log("✓ Screenshot Hero salvo: tools/art/rescue-01-hero.png");

  // 2. Rola até Projetos Nucleares & Topologia
  console.log("Rolando até Projetos Nucleares...");
  await page.evaluate(() => {
    const el = document.getElementById("projetos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "tools/art/rescue-02-projetos-graph.png" });
  console.log("✓ Screenshot Projetos & Grafo salvo: tools/art/rescue-02-projetos-graph.png");

  // Rola até os cards nucleares
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "tools/art/rescue-03-nucleares-cards.png" });
  console.log("✓ Screenshot Cards Nucleares salvo: tools/art/rescue-03-nucleares-cards.png");

  // 3. Rola até Projetos de Suporte
  console.log("Rolando até Projetos de Suporte...");
  await page.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll("h3")).find((h) =>
      h.innerText.includes("PROJETOS DE SUPORTE")
    );
    if (h3) h3.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "tools/art/rescue-04-suporte.png" });
  console.log("✓ Screenshot Projetos de Suporte salvo: tools/art/rescue-04-suporte.png");

  // 4. Rola até Arsenal Técnico
  console.log("Rolando até Arsenal Técnico...");
  await page.evaluate(() => {
    const el = document.getElementById("arsenal");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "tools/art/rescue-05-arsenal.png" });
  console.log("✓ Screenshot Arsenal Técnico salvo: tools/art/rescue-05-arsenal.png");

  // 5. Rola até Jornada de Engenharia
  console.log("Rolando até Jornada de Engenharia...");
  await page.evaluate(() => {
    const el = document.getElementById("jornada");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "tools/art/rescue-06-jornada.png" });
  console.log("✓ Screenshot Jornada salvo: tools/art/rescue-06-jornada.png");

  // 6. Rola até Princípios de Construção
  console.log("Rolando até Princípios de Construção...");
  await page.evaluate(() => {
    const el = document.getElementById("principios");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "tools/art/rescue-07-principios.png" });
  console.log("✓ Screenshot Princípios salvo: tools/art/rescue-07-principios.png");

  // 7. Auditoria de Estilos Computados em todos os elementos
  const audit = await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll("h1, h2, h3, article, p, button, a")
    );
    let invisibleCount = 0;
    let blurredCount = 0;

    elements.forEach((el) => {
      const cs = window.getComputedStyle(el);
      if (cs.opacity === "0" || cs.visibility === "hidden") invisibleCount++;
      if (cs.filter && cs.filter !== "none" && cs.filter.includes("blur")) {
        blurredCount++;
      }
    });

    return {
      totalElementsAudited: elements.length,
      invisibleCount,
      blurredCount,
      bodyOverflowX: document.body.scrollWidth > window.innerWidth,
    };
  });

  console.log("Auditoria de Visibilidade & Nitidez:", audit);

  // 8. Teste Mobile (iPhone 14 - 390x844)
  console.log("Testando Viewport Mobile (390x844)...");
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: "tools/art/rescue-08-mobile.png" });
  console.log("✓ Screenshot Mobile salvo: tools/art/rescue-08-mobile.png");

  const mobileAudit = await mobilePage.evaluate(() => ({
    bodyOverflowX: document.body.scrollWidth > window.innerWidth,
    scrollWidth: document.body.scrollWidth,
    clientWidth: window.innerWidth,
  }));
  console.log("Auditoria Mobile Overflow:", mobileAudit);

  console.log(
    "Erros no Console:",
    consoleErrors.length === 0 ? "0 ERROS (LIMPO)" : consoleErrors
  );

  await browser.close();
  console.log("=== HOMOLOGAÇÃO PLAYWRIGHT CONCLUÍDA COM SUCESSO ===");
}

verifyMotionRescue().catch(console.error);
