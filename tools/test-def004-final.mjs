import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Verificando deploy em https://portifolio-thiago-ibrahim.vercel.app/ ...");
  
  // Tenta até 6 vezes (com intervalo de 5s) para esperar o deploy da Vercel
  let passed = false;
  let titlesResult = [];

  for (let attempt = 1; attempt <= 6; attempt++) {
    console.log(`Tentativa ${attempt}/6...`);
    await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const titles = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
      return headings.map((h) => {
        const parent = h.closest("div");
        return {
          tag: h.tagName,
          text: h.innerText.slice(0, 30).trim(),
          computedFilter: window.getComputedStyle(h).filter,
          parentComputedFilter: parent ? window.getComputedStyle(parent).filter : "none",
        };
      });
    });

    const anyBlur = titles.some(
      (t) =>
        (t.computedFilter && t.computedFilter !== "none") ||
        (t.parentComputedFilter && t.parentComputedFilter !== "none")
    );

    console.log(`Filtros ativos detectados: ${anyBlur ? "SIM (aguardando deploy...)" : "NÃO (100% LIMPO)"}`);

    if (!anyBlur) {
      passed = true;
      titlesResult = titles;
      break;
    }
    await page.waitForTimeout(5000);
  }

  console.log("Status da homologação:", passed ? "PASS" : "TIMEOUT");
  console.log("Amostra de títulos:", JSON.stringify(titlesResult.slice(0, 8), null, 2));

  // Tira print de página inteira homologado
  await page.screenshot({ path: "tools/art/fullpage-homologated-def004.png", fullPage: true });
  console.log("Print salvo em tools/art/fullpage-homologated-def004.png");

  await browser.close();
}

run().catch(console.error);
