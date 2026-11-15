import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  hasTouch: true,
  isMobile: true
});
const page = await context.newPage();
await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
await page.locator("#projetos").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const card1Btn = page.locator('#projetos .overflow-x-auto article button').first();
console.log("card1Btn count:", await card1Btn.count());
console.log("card1Btn isVisible:", await card1Btn.isVisible());

await card1Btn.scrollIntoViewIfNeeded();
await card1Btn.click();
await page.waitForTimeout(800);

const modal = await page.evaluate(() => {
  const m = document.querySelector('div[class*="z-[9999]"]');
  const rect = m?.querySelector('div[class*="rounded-2xl"]')?.getBoundingClientRect();
  return {
    open: !!m,
    title: m?.querySelector("h3")?.innerText?.trim(),
    rect: rect ? { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom } : null,
    windowHeight: window.innerHeight,
  };
});
console.log("Modal no iPhone SE 375:", JSON.stringify(modal));

await browser.close();
