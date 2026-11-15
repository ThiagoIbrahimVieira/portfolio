import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });

// Scroll gradual até o fim (simula usuário real)
await page.evaluate(async () => {
  const step = 600;
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(1200);

const cards = await page.evaluate(() => {
  const section = document.querySelector("#projetos");
  const grid = section?.querySelector(".grid");
  const items = grid ? Array.from(grid.children) : [];
  return {
    total: items.length,
    visiveis: items.filter((el) => {
      const s = getComputedStyle(el);
      return parseFloat(s.opacity) > 0.95;
    }).length,
    gridHeight: grid?.getBoundingClientRect().height ?? 0,
  };
});
console.log("Cards:", JSON.stringify(cards));

// captura da seção projetos em viewport real
await page.locator("#projetos").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: "tools/art/projetos.png" });

// alte mobile: secao projetos
const page2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page2.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
await page2.evaluate(async () => {
  for (let y = 0; y <= document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page2.waitForTimeout(1000);
await page2.locator("#projetos").scrollIntoViewIfNeeded();
await page2.waitForTimeout(600);
await page2.screenshot({ path: "tools/art/projetos-mobile.png" });

await browser.close();
console.log("OK scroll-check");
