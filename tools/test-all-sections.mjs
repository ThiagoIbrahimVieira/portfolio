import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function checkSections() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to Vercel live URL...");
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const sections = ["projetos", "arsenal", "jornada", "principios", "contato"];
  for (const id of sections) {
    console.log(`\n--- Scrolling to #${id} ---`);
    await page.evaluate((secId) => {
      const el = document.getElementById(secId);
      if (el) el.scrollIntoView({ behavior: "instant" });
    }, id);
    await page.waitForTimeout(600);

    const status = await page.evaluate((secId) => {
      const sec = document.getElementById(secId);
      if (!sec) return { found: false };
      const elements = Array.from(sec.querySelectorAll("h2, h3, article, li, figure"));
      const zeros = elements.filter((el) => window.getComputedStyle(el).opacity === "0");
      const visible = elements.filter((el) => window.getComputedStyle(el).opacity !== "0");
      return {
        found: true,
        totalElements: elements.length,
        zerosCount: zeros.length,
        visibleCount: visible.length,
        sampleZeros: zeros.slice(0, 3).map((z) => ({
          tag: z.tagName,
          text: z.innerText?.slice(0, 30),
          style: z.getAttribute("style"),
        })),
      };
    }, id);

    console.log(`Status for #${id}:`, status);
  }

  await browser.close();
}

checkSections().catch(console.error);
