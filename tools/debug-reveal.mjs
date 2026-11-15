import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("console", (msg) => console.log("[BROWSER CONSOLE]", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("[BROWSER ERROR]", err.message));

  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });

  const result = await page.evaluate(() => {
    // Check if gsap object exists anywhere on window or imports
    const h1 = document.querySelector("h1");
    return {
      h1Text: h1?.innerText,
      h1Parent: h1?.parentElement?.tagName,
      h1ParentParent: h1?.parentElement?.parentElement?.tagName,
      h1Style: h1?.getAttribute("style"),
      parentStyle: h1?.parentElement?.getAttribute("style"),
      grandParentStyle: h1?.parentElement?.parentElement?.getAttribute("style"),
    };
  });
  console.log("H1 DOM tree styles:", result);

  await browser.close();
}

run().catch(console.error);
