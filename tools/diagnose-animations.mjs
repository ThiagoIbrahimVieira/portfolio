import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function diagnose() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleLogs = [];
  page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => consoleLogs.push(`[ERROR] ${err.message}`));

  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });

  const initialState = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll("section"));
    return sections.map((s) => {
      const heading = s.querySelector("h1, h2, h3");
      const cs = window.getComputedStyle(s);
      const hc = heading ? window.getComputedStyle(heading) : null;
      return {
        id: s.id,
        heading: heading ? heading.innerText.trim().slice(0, 25) : null,
        sectionOpacity: cs.opacity,
        headingOpacity: hc ? hc.opacity : null,
        headingTransform: hc ? hc.transform : null,
      };
    });
  });

  console.log("Initial State (top):", JSON.stringify(initialState, null, 2));

  // Check what happens when we scroll slowly
  console.log("Scrolling down 1000px...");
  await page.evaluate(() => window.scrollBy({ top: 1000, behavior: "instant" }));
  await page.waitForTimeout(500);

  const afterScroll1 = await page.evaluate(() => {
    const proj = document.getElementById("projetos");
    const h2 = proj?.querySelector("h2");
    return {
      projOpacity: proj ? window.getComputedStyle(proj).opacity : null,
      h2Opacity: h2 ? window.getComputedStyle(h2).opacity : null,
      h2Transform: h2 ? window.getComputedStyle(h2).transform : null,
    };
  });
  console.log("After scroll to Projetos:", afterScroll1);

  // Check console logs
  console.log("Console logs:", consoleLogs);

  await browser.close();
}

diagnose().catch(console.error);
