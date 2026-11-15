import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to Vercel live URL...");
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Take screenshot without scrolling (full page)
  await page.screenshot({ path: "tools/art/live-fullpage-initial.png", fullPage: true });
  console.log("Fullpage initial screenshot taken: tools/art/live-fullpage-initial.png");

  // Now smooth scroll slowly through the whole page
  console.log("Smooth scrolling through the page...");
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log("Total height:", totalHeight);

  for (let y = 0; y < totalHeight; y += 400) {
    await page.evaluate((scrollPos) => window.scrollTo({ top: scrollPos, behavior: "smooth" }), y);
    await page.waitForTimeout(300);
  }

  await page.waitForTimeout(1500);
  await page.screenshot({ path: "tools/art/live-fullpage-after-scroll.png", fullPage: true });
  console.log("Fullpage after scroll screenshot taken: tools/art/live-fullpage-after-scroll.png");

  // Check how many elements still have opacity: 0
  const remainingZeroOpacity = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("*"));
    return all.filter((el) => {
      const s = window.getComputedStyle(el);
      return s.opacity === "0" && el.offsetWidth > 0 && el.offsetHeight > 0;
    }).map((el) => ({
      tag: el.tagName,
      className: el.className,
      text: el.innerText ? el.innerText.slice(0, 50) : "",
    }));
  });
  console.log("Elements still at opacity 0:", remainingZeroOpacity.length, remainingZeroOpacity.slice(0, 10));

  await browser.close();
}

main().catch(console.error);
