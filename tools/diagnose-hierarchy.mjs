import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function checkH2Parents() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });

  const parents = await page.evaluate(() => {
    const h2 = document.querySelector("#projetos-heading");
    let curr = h2;
    const hierarchy = [];
    while (curr && curr.tagName !== "BODY") {
      hierarchy.push({
        tag: curr.tagName,
        id: curr.id,
        className: curr.className,
        style: curr.getAttribute("style"),
        computedOpacity: window.getComputedStyle(curr).opacity,
        computedTransform: window.getComputedStyle(curr).transform,
      });
      curr = curr.parentElement;
    }
    return hierarchy;
  });

  console.log("Hierarchy of #projetos-heading:", JSON.stringify(parents, null, 2));

  await browser.close();
}

checkH2Parents().catch(console.error);
