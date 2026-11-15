import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("1. Acessando https://portifolio-thiago-ibrahim.vercel.app/ ...");
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Navega até a seção
  const pos = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
    return h ? h.getBoundingClientRect().top + window.scrollY : null;
  });
  console.log("Posição da seção:", pos);

  await page.evaluate((targetY) => window.scrollTo(0, targetY - 100), pos);
  await page.waitForTimeout(800);

  // 2 & 3. Validação de Nitidez e Propriedade filter computada
  const audit = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h3")).find((el) => el.innerText.includes("PROJETOS DE SUPORTE"));
    const sectionContainer = h?.closest("div.mt-20");
    const cardsGrid = sectionContainer?.querySelector("div.grid");
    const cardElements = Array.from(cardsGrid?.querySelectorAll("article") || []);

    const cardsData = cardElements.map((card) => {
      const title = card.querySelector("h4")?.innerText || card.querySelector("h3")?.innerText || "Card";
      const style = window.getComputedStyle(card);
      return {
        title,
        id: card.id,
        filter: style.filter,
        opacity: style.opacity,
        visibility: style.visibility,
        transform: card.style.transform,
      };
    });

    return {
      headingText: h?.innerText,
      headingFilter: h ? window.getComputedStyle(h).filter : null,
      parentContainerFilter: sectionContainer ? window.getComputedStyle(sectionContainer).filter : null,
      gridFilter: cardsGrid ? window.getComputedStyle(cardsGrid).filter : null,
      cardsCount: cardElements.length,
      cards: cardsData,
    };
  });

  console.log("Resultado da Auditoria:", JSON.stringify(audit, null, 2));

  // 4. Teste de 3D tilt e clique no primeiro card de suporte (SpaceSweep)
  const firstCard = page.locator('#project-spacesweep');
  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.hover({ position: { x: 30, y: 30 } });
  await page.waitForTimeout(200);

  const tiltState = await page.evaluate(() => {
    const card = document.querySelector('#project-spacesweep');
    return card?.getAttribute('style');
  });
  console.log("3D Tilt no hover:", tiltState);

  // Screenshot de evidência
  await page.screenshot({ path: "tools/art/def003-homologated-proof.png" });
  console.log("Screenshot de evidência salva em tools/art/def003-homologated-proof.png");

  await browser.close();
}

run().catch(console.error);
