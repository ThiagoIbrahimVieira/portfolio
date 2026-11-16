import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const LOCAL_URL = "http://localhost:3000/";
const ART_DIR = "C:/Users/thiag/Documents/Projetos/portfolio-tt/tools/art";

if (!fs.existsSync(ART_DIR)) {
  fs.mkdirSync(ART_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080, isMobile: false },
  { name: "desktop-1440", width: 1440, height: 900, isMobile: false },
  { name: "notebook-1366", width: 1366, height: 768, isMobile: false },
  { name: "tablet-768", width: 768, height: 1024, isMobile: true },
  { name: "mobile-430", width: 430, height: 932, isMobile: true },
  { name: "mobile-390", width: 390, height: 844, isMobile: true },
];

async function runAudit() {
  console.log("=== INICIANDO AUDITORIA PERFECT FIT & MOTION (PLAYWRIGHT) ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = {};

  for (const vp of VIEWPORTS) {
    console.log(`\nAuditando viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto(LOCAL_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    const metrics = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const docH = document.documentElement.scrollHeight;
      const hasHorizontalOverflow = docW > winW;

      // Find any elements exceeding viewport width
      const overflowingElements = [];
      const allEls = document.querySelectorAll("*");
      for (const el of allEls) {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW + 1 && el.clientWidth > 0 && rect.width > 0) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || "").toString().slice(0, 60),
            right: Math.round(rect.right),
            winW,
          });
        }
      }

      // Check Hero
      const hero = document.querySelector("#hero");
      const heroRect = hero ? hero.getBoundingClientRect() : null;
      const h1 = document.querySelector("#hero h1");
      const sticker = document.querySelector(".hero-sticker");
      const cta = document.querySelector(".hero-cta");

      return {
        docW,
        winW,
        docH,
        hasHorizontalOverflow,
        overflowCount: overflowingElements.length,
        overflowSamples: overflowingElements.slice(0, 5),
        hero: {
          height: heroRect ? Math.round(heroRect.height) : null,
          h1Width: h1 ? Math.round(h1.getBoundingClientRect().width) : null,
          stickerWidth: sticker ? Math.round(sticker.getBoundingClientRect().width) : null,
          ctaVisible: cta ? cta.getBoundingClientRect().bottom <= window.innerHeight : null,
        },
      };
    });

    results[vp.name] = {
      ...metrics,
      consoleErrors,
    };

    console.log(`- Overflow horizontal: ${metrics.hasHorizontalOverflow ? "FALHA ❌" : "ZERO (OK) ✅"} (docW: ${metrics.docW}px, winW: ${metrics.winW}px)`);
    console.log(`- Elementos extravasando: ${metrics.overflowCount}`);
    console.log(`- Console errors: ${consoleErrors.length}`);

    // Screenshot
    const ssPath = path.join(ART_DIR, `perfect-fit-${vp.name}.png`);
    await page.screenshot({ path: ssPath, fullPage: false });
    console.log(`- Screenshot salvo: ${ssPath}`);

    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(ART_DIR, "perfect-fit-results.json"), JSON.stringify(results, null, 2));
  console.log("\n=== AUDITORIA FINALIZADA COM SUCESSO ===");
}

runAudit().catch(console.error);
