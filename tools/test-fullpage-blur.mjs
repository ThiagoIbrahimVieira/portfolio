import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Faz captura de página inteira sem rolar previamente
  console.log("Capturando página inteira imediata...");
  await page.screenshot({ path: "tools/art/fullpage-current-repro.png", fullPage: true });

  // Inspeciona os filtros computados de todos os h1, h2, h3 da página
  const titles = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
    return headings.map((h) => {
      const parent = h.closest('div[style*="filter"]') || h.parentElement;
      return {
        tag: h.tagName,
        text: h.innerText.slice(0, 30),
        computedFilter: window.getComputedStyle(h).filter,
        parentComputedFilter: parent ? window.getComputedStyle(parent).filter : "none",
        parentStyle: parent?.getAttribute("style"),
      };
    });
  });

  console.log("Títulos encontrados e filtros:", JSON.stringify(titles, null, 2));

  await browser.close();
}

run().catch(console.error);
