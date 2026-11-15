import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function checkProduction() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Verifica se o container pai tem RevealSection ou se é uma div comum
  const structure = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
    if (!h) return { found: false };
    const sectionContainer = h.closest("div.mt-20");
    const parent = sectionContainer?.parentElement;
    const cardsGrid = sectionContainer?.querySelector("div.grid");
    return {
      found: true,
      parentTagName: parent?.tagName,
      parentHasMotion: parent?.classList.contains("motion") || parent?.getAttribute("style")?.includes("transform"),
      sectionContainerStyle: sectionContainer?.getAttribute("style"),
      cardsGridParentStyle: cardsGrid?.parentElement?.getAttribute("style"),
      cardsGridComputedFilter: cardsGrid ? window.getComputedStyle(cardsGrid).filter : null,
    };
  });

  console.log("Estrutura em produção:", JSON.stringify(structure));
  await browser.close();
}

checkProduction().catch(console.error);
