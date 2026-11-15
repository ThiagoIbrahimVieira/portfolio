import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  page.on("console", (msg) => logs.push({ type: msg.type(), text: msg.text() }));
  page.on("pageerror", (err) => logs.push({ type: "pageerror", text: err.message, stack: err.stack }));

  console.log("Navigating to Vercel live URL...");
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const initialCheck = await page.evaluate(() => {
    const el = document.getElementById("projetos");
    const reveals = Array.from(document.querySelectorAll("#projetos [style*='opacity']"));
    const allReveals = Array.from(document.querySelectorAll("[style*='opacity']"));
    return {
      projetosExists: !!el,
      projetosRect: el ? el.getBoundingClientRect() : null,
      revealElementsCount: reveals.length,
      allOpacityCount: allReveals.length,
      allOpacityDetails: allReveals.slice(0, 10).map((r) => ({
        tag: r.tagName,
        class: r.className,
        style: r.getAttribute("style"),
        computedOpacity: window.getComputedStyle(r).opacity,
        rect: r.getBoundingClientRect(),
      })),
    };
  });
  console.log("Initial check:", JSON.stringify(initialCheck, null, 2));

  // Now scroll down
  console.log("Simulating wheel scroll down 1200px...");
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(1000);

  const scrolledCheck = await page.evaluate(() => {
    const el = document.getElementById("projetos");
    const allReveals = Array.from(document.querySelectorAll("[style*='opacity']"));
    return {
      scrollY: window.scrollY,
      projetosRect: el ? el.getBoundingClientRect() : null,
      allOpacityDetails: allReveals.slice(0, 10).map((r) => ({
        tag: r.tagName,
        class: r.className,
        style: r.getAttribute("style"),
        computedOpacity: window.getComputedStyle(r).opacity,
        rect: r.getBoundingClientRect(),
      })),
    };
  });
  console.log("Scrolled check:", JSON.stringify(scrolledCheck, null, 2));
  console.log("Console logs:", logs);

  await browser.close();
}

main().catch(console.error);
