import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

// Cenário A: Clicar no link do navbar "#projetos"
console.log("--- Cenário A: Navegação direta via hash/link ---");
await page.click('header nav a[href="#projetos"]');
await page.waitForTimeout(1000);

// Agora rola 600px para baixo onde ficam os outros projetos
await page.mouse.wheel(0, 600);
await page.waitForTimeout(500);

let checkA = await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
  const p = h?.closest('div[style*="filter"]');
  return {
    headingVisible: h ? h.getBoundingClientRect().top : null,
    parentStyle: p ? p.getAttribute("style") : null,
    computedFilter: p ? window.getComputedStyle(p).filter : null,
  };
});
console.log("Cenário A:", JSON.stringify(checkA));
await page.screenshot({ path: "tools/art/cenario-a.png" });

// Cenário B: Recarrega direto na seção ou rola rápido
console.log("--- Cenário B: Scroll rápido direto para a posição da foto do usuário ---");
await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
// Rola imediatamente para Y = 2200 onde fica a seção
await page.evaluate(() => window.scrollTo(0, 2200));
await page.waitForTimeout(200);

let checkB = await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
  const p = h?.closest('div[style*="filter"]');
  return {
    headingTop: h ? h.getBoundingClientRect().top : null,
    parentStyle: p ? p.getAttribute("style") : null,
    computedFilter: p ? window.getComputedStyle(p).filter : null,
    opacity: p ? window.getComputedStyle(p).opacity : null,
  };
});
console.log("Cenário B (200ms após scroll):", JSON.stringify(checkB));

await page.waitForTimeout(2000);
let checkB_later = await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
  const p = h?.closest('div[style*="filter"]');
  return {
    parentStyle: p ? p.getAttribute("style") : null,
    computedFilter: p ? window.getComputedStyle(p).filter : null,
  };
});
console.log("Cenário B (2s após scroll):", JSON.stringify(checkB_later));

await browser.close();
