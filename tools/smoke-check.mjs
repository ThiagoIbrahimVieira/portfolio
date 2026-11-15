/**
 * Smoke check local do portfólio — rodado com `node tools/smoke-check.mjs`.
 * Não altera código; valida runtime real em 3 viewports:
 * console errors, navegação por âncoras, overflow horizontal e capturas de tela.
 * playwright-core resolve o Chrome instalado localmente (channel: "chrome").
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const BASE = "http://localhost:3000";
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

const consoleErrors = [];
const pageErrors = [];
const results = [];

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: "reduce", // estagna animações para checagem estável
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`[${vp.name}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => pageErrors.push(`[${vp.name}] ${err.message}`));

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 30000 });

  // Overflow horizontal tolerante (scrollbar pode somar 15px)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );

  // Navegação por âncora: clica o link do navbar, espera hash mudar
  let navOk = false;
  if (vp.name === "desktop") {
    const link = page.locator('nav a[href="#projetos"]').first();
    await link.click();
    navOk = await page
      .waitForFunction(() => location.hash === "#projetos", { timeout: 5000 })
      .then(() => true)
      .catch(() => false);
  }

  // Checkpoint visual da viewport atual
  await page.screenshot({ path: `tools/art/${vp.name}.png`, fullPage: false });

  results.push({ viewport: vp.name, overflowPx: overflow, navAnchorOk: vp.name === "desktop" ? navOk : "n/a" });
  await context.close();
}

// Reduced-motion OFF (o padrão): confere se o canvas existe e tem contexto 2D
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`[anim] ${msg.text()}`);
});
page.on("pageerror", (err) => pageErrors.push(`[anim] ${err.message}`));
await page.goto(BASE, { waitUntil: "networkidle", timeout: 30000 });
const canvasInfo = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return { present: false };
  return { present: true, w: c.width, h: c.height };
});
await page.screenshot({ path: "tools/art/desktop-animated.png", fullPage: false });
await context.close();

await browser.close();

console.log("=== RESULTADOS ===");
for (const r of results) console.log(JSON.stringify(r));
console.log("Canvas:", JSON.stringify(canvasInfo));
console.log("Console errors:", consoleErrors.length ? consoleErrors : "nenhum");
console.log("Page errors:", pageErrors.length ? pageErrors : "nenhum");
