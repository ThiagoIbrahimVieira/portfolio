import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function check() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });

  console.log("Rolando até o primeiro card nuclear (#project-desktop-codeatlas)...");
  const card = page.locator("#project-desktop-codeatlas");
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const state = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("[id^='project-desktop-']"));
    return cards.map((c) => {
      const reveal = c.parentElement;
      return {
        id: c.id,
        cardComputedOpacity: window.getComputedStyle(c).opacity,
        revealStyle: reveal ? reveal.getAttribute("style") : null,
        revealComputedOpacity: reveal ? window.getComputedStyle(reveal).opacity : "no-reveal",
      };
    });
  });

  console.log("Cards visíveis:", JSON.stringify(state, null, 2));
  await page.screenshot({ path: "tools/art/desktop-cards-grid.png" });
  await browser.close();
}

check().catch(console.error);
