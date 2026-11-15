import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  console.log("=== INICIANDO HOMOLOGAÇÃO REAL EM NAVEGADOR COM PLAYWRIGHT ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  // PASSO 1 & 2: Acessa localhost:3000
  console.log("Acessando http://localhost:3000/ ...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  // PASSO 3: Verifica Hero logo após load (animações de entrada)
  await page.waitForTimeout(600);
  await page.screenshot({ path: "tools/art/gsap-01-hero.png" });
  console.log("✓ Screenshot Hero salvo: tools/art/gsap-01-hero.png");

  // PASSO 4: Rola até Projetos Nucleares e Grafo
  console.log("Rolando até Projetos Nucleares...");
  await page.evaluate(() => {
    const el = document.getElementById("projetos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tools/art/gsap-02-projetos.png" });
  console.log("✓ Screenshot Projetos Nucleares salvo: tools/art/gsap-02-projetos.png");

  // PASSO 5: Rola até Projetos de Suporte & Laboratório
  console.log("Rolando até Projetos de Suporte & Laboratório...");
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("h3")).find((h) => h.innerText.includes("PROJETOS DE SUPORTE"));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tools/art/gsap-03-suporte.png" });
  console.log("✓ Screenshot Suporte & Laboratório salvo: tools/art/gsap-03-suporte.png");

  // PASSO 6: Rola até Arsenal Técnico
  console.log("Rolando até Arsenal Técnico...");
  await page.evaluate(() => {
    const el = document.getElementById("arsenal");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tools/art/gsap-04-arsenal.png" });
  console.log("✓ Screenshot Arsenal Técnico salvo: tools/art/gsap-04-arsenal.png");

  // PASSO 7: Rola até Jornada de Engenharia
  console.log("Rolando até Jornada de Engenharia...");
  await page.evaluate(() => {
    const el = document.getElementById("jornada");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tools/art/gsap-05-jornada.png" });
  console.log("✓ Screenshot Jornada salvo: tools/art/gsap-05-jornada.png");

  // PASSO 8: Rola até Princípios e Contato
  console.log("Rolando até Princípios e Contato...");
  await page.evaluate(() => {
    const el = document.getElementById("principios");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tools/art/gsap-06-principios.png" });
  console.log("✓ Screenshot Princípios salvo: tools/art/gsap-06-principios.png");

  // PASSO 9: Checagem de visibilidade e ausência de blur em todos os elementos
  const auditResults = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("h1, h2, h3, article, p, button, a"));
    let invisibleCount = 0;
    let blurredCount = 0;

    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.opacity === "0" || style.visibility === "hidden") invisibleCount++;
      if (style.filter && style.filter !== "none" && style.filter.includes("blur")) blurredCount++;
    });

    return {
      totalElements: elements.length,
      invisibleCount,
      blurredCount,
      bodyOverflowX: document.body.scrollWidth > window.innerWidth,
    };
  });

  console.log("Auditoria Desktop:", JSON.stringify(auditResults, null, 2));

  // PASSO 10: Viewport Mobile
  console.log("Testando Viewport Mobile (375x812)...");
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 });
  await mobilePage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: "tools/art/gsap-07-mobile-hero.png" });

  await mobilePage.evaluate(() => window.scrollBy({ top: 1200, behavior: "smooth" }));
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: "tools/art/gsap-08-mobile-projetos.png" });

  const mobileAudit = await mobilePage.evaluate(() => ({
    bodyOverflowX: document.body.scrollWidth > window.innerWidth,
    scrollWidth: document.body.scrollWidth,
    clientWidth: window.innerWidth,
  }));
  console.log("Auditoria Mobile:", JSON.stringify(mobileAudit, null, 2));

  console.log("Erros no Console:", consoleErrors.length === 0 ? "NENHUM (0 erros)" : consoleErrors);

  await browser.close();
  console.log("=== HOMOLOGAÇÃO PLAYWRIGHT CONCLUÍDA ===");
}

run().catch(console.error);
