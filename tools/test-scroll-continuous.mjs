import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Simula scroll contínuo com mouse wheel, como um usuário real lendo a página
  console.log("Iniciando scroll contínuo...");
  let capturedStuck = null;

  for (let y = 0; y <= 5500; y += 150) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(50); // velocidade de scroll humano rápido

    const state = await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
      if (!h) return null;
      const revealWrapper = h.closest("div.mt-20")?.parentElement;
      const rect = h.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      return {
        scrollY: window.scrollY,
        hTop: rect.top,
        inView,
        filter: revealWrapper ? window.getComputedStyle(revealWrapper).filter : null,
        opacity: revealWrapper ? window.getComputedStyle(revealWrapper).opacity : null,
        styleAttr: revealWrapper?.getAttribute("style"),
      };
    });

    if (state && state.inView) {
      console.log(`scrollY: ${state.scrollY} | hTop: ${Math.round(state.hTop)} | filter: ${state.filter} | opacity: ${state.opacity}`);
      if (state.filter && state.filter !== "none" && state.filter !== "blur(0px)" && state.hTop < 200 && state.hTop > 50) {
        capturedStuck = state;
      }
    }
  }

  // Agora vamos esperar 3 segundos sem mexer e verificar se continua com blur ou se limpou
  await page.waitForTimeout(3000);
  const finalState = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
    const revealWrapper = h?.closest("div.mt-20")?.parentElement;
    return {
      filter: revealWrapper ? window.getComputedStyle(revealWrapper).filter : null,
      opacity: revealWrapper ? window.getComputedStyle(revealWrapper).opacity : null,
      styleAttr: revealWrapper?.getAttribute("style"),
    };
  });
  console.log("Estado final parado:", JSON.stringify(finalState));

  await browser.close();
}

run().catch(console.error);
