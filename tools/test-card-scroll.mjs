import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function checkCard() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });

  console.log("Rolando diretamente até o card CodeAtlas no grid desktop...");
  await page.evaluate(() => {
    const el = document.getElementById("project-desktop-codeatlas");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(800);

  const state = await page.evaluate(() => {
    const el = document.getElementById("project-desktop-codeatlas");
    if (!el) return { found: false };
    const wrapper = el.closest("[style*='opacity']") || el;
    return {
      found: true,
      cardId: el.id,
      wrapperOpacity: window.getComputedStyle(wrapper).opacity,
      cardTransform: window.getComputedStyle(el).transform,
      allDesktopCards: Array.from(document.querySelectorAll("[id^='project-desktop-']")).map((c) => ({
        id: c.id,
        opacity: window.getComputedStyle(c.closest("[style*='opacity']") || c).opacity,
        rect: c.getBoundingClientRect(),
      })),
    };
  });

  console.log("Estado dos Cards após rolar até eles:", JSON.stringify(state, null, 2));
  await page.screenshot({ path: "tools/art/card-in-view-test.png" });
  console.log("Screenshot salvo: tools/art/card-in-view-test.png");
  await browser.close();
}

checkCard().catch(console.error);
