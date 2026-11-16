import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function check() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  for (const [w, h] of [[1366, 600], [1366, 620], [1366, 650], [1366, 768]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const data = await page.evaluate((vpHeight) => {
      const getRect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          top: Math.round(b.top),
          bottom: Math.round(b.bottom),
          height: Math.round(b.height),
          visible: b.bottom <= vpHeight,
          marginToBottom: Math.round(vpHeight - b.bottom)
        };
      };
      return {
        vpHeight,
        telemetry: getRect(".hero-telemetry"),
        title: getRect("#hero h1"),
        subtitle: getRect(".hero-subtitle"),
        badges: getRect(".hero-badge"),
        ctas: getRect(".hero-cta"),
        ctaButtons: Array.from(document.querySelectorAll(".hero-cta a")).map(a => ({
          text: a.textContent?.trim().slice(0, 25),
          bottom: Math.round(a.getBoundingClientRect().bottom),
          visible: a.getBoundingClientRect().bottom <= vpHeight
        })),
        sticker: getRect(".hero-sticker"),
        seal: getRect(".hero-seal"),
        manifest: getRect(".hero-manifest")
      };
    }, h);
    console.log(`\n=== VIEWPORT 1366x${h} ===\n`, JSON.stringify(data, null, 2));
    await page.screenshot({ path: `C:/Users/thiag/Documents/Projetos/portfolio-tt/tools/art/hero-fit-1366x${h}.png` });
    await page.close();
  }
  await browser.close();
}

check().catch(console.error);
