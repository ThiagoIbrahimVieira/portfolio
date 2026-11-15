import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

// Rola lentamente até a seção de outros projetos
await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
  if (h) {
    const y = h.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: y, behavior: "instant" });
  }
});

await page.waitForTimeout(1200);

const result = await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
  if (!h) return { found: false };

  // Encontra o container RevealSection ancestral
  let cur = h.parentElement;
  const ancestors = [];
  while (cur && cur.id !== "projetos") {
    ancestors.push({
      tag: cur.tagName,
      className: cur.className,
      styleAttr: cur.getAttribute("style"),
      filter: window.getComputedStyle(cur).filter,
      opacity: window.getComputedStyle(cur).opacity,
      transform: window.getComputedStyle(cur).transform,
    });
    cur = cur.parentElement;
  }

  // Também checa os cards filhos
  const cards = Array.from(document.querySelectorAll("#projetos .grid.md\\:grid-cols-3 article")).map((card) => {
    let p = card.parentElement;
    return {
      title: card.querySelector("h3")?.innerText,
      parentStyle: p?.getAttribute("style"),
      parentFilter: p ? window.getComputedStyle(p).filter : null,
      parentOpacity: p ? window.getComputedStyle(p).opacity : null,
    };
  });

  return {
    found: true,
    ancestors,
    cards,
  };
});

console.log(JSON.stringify(result, null, 2));

// Captura screenshot para verificar visualmente
await page.screenshot({ path: "tools/art/debug-blur.png" });

await browser.close();
