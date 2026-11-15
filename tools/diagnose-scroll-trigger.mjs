import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function testScrollAnimation() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });

  const getTargetStyle = async () => {
    return page.evaluate(() => {
      const h2 = document.querySelector("#projetos-heading");
      const revealDiv = h2?.parentElement?.parentElement?.parentElement; // The DIV with opacity: 0
      return {
        style: revealDiv?.getAttribute("style"),
        computedOpacity: revealDiv ? window.getComputedStyle(revealDiv).opacity : null,
        computedTransform: revealDiv ? window.getComputedStyle(revealDiv).transform : null,
        boundingRect: revealDiv?.getBoundingClientRect(),
        scrollY: window.scrollY,
      };
    });
  };

  console.log("Before scroll:", await getTargetStyle());

  // Rola até o elemento
  console.log("Scrolling element into view...");
  await page.evaluate(() => {
    const h2 = document.querySelector("#projetos-heading");
    h2?.scrollIntoView({ behavior: "smooth" });
  });

  for (let i = 1; i <= 10; i++) {
    await page.waitForTimeout(200);
    const s = await getTargetStyle();
    console.log(`At +${i * 200}ms (scrollY=${s.scrollY}): opacity=${s.computedOpacity}, style=${s.style}`);
  }

  await browser.close();
}

testScrollAnimation().catch(console.error);
