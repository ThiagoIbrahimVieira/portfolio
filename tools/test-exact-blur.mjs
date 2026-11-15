import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const pos = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
    return h ? h.getBoundingClientRect().top + window.scrollY : null;
  });
  console.log("Posição absoluta Y do heading:", pos);

  // Rola exatamente para a visão da foto (heading ~100px abaixo do topo)
  await page.evaluate((targetY) => window.scrollTo(0, targetY - 100), pos);
  
  // Vamos registrar no momento imediato (50ms), depois em 300ms, 600ms, 1200ms
  for (const delay of [50, 200, 500, 1000, 2000]) {
    await page.waitForTimeout(delay);
    const state = await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
      // O container com RevealSection
      const revealWrapper = h?.closest("div.mt-20")?.parentElement;
      return {
        hTop: h ? h.getBoundingClientRect().top : null,
        wrapperTag: revealWrapper?.tagName,
        styleAttr: revealWrapper?.getAttribute("style"),
        computedFilter: revealWrapper ? window.getComputedStyle(revealWrapper).filter : null,
        computedOpacity: revealWrapper ? window.getComputedStyle(revealWrapper).opacity : null,
        computedTransform: revealWrapper ? window.getComputedStyle(revealWrapper).transform : null,
      };
    });
    console.log(`Estado após +${delay}ms:`, JSON.stringify(state));
  }

  await page.screenshot({ path: "tools/art/user-exact-view.png" });
  await browser.close();
}

run().catch(console.error);
