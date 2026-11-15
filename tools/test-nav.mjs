import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to Vercel live URL...");
  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Click on "PROJETOS" in navbar
  console.log("Clicking #projetos navbar link...");
  const navLink = await page.$("a[href='#projetos']");
  if (navLink) {
    await navLink.click();
  } else {
    console.log("Navbar link not found, trying evaluate scroll...");
    await page.evaluate(() => {
      document.querySelector("a[href*='projetos']")?.click();
    });
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tools/art/test-navbar-click.png" });

  const projetosStatus = await page.evaluate(() => {
    const el = document.getElementById("projetos");
    const h2 = document.getElementById("projetos-heading");
    const cards = Array.from(document.querySelectorAll("#projetos article"));
    return {
      scrollY: window.scrollY,
      h2Opacity: h2 ? window.getComputedStyle(h2.parentElement?.parentElement || h2).opacity : null,
      cardsCount: cards.length,
      cardsOpacities: cards.map((c) => window.getComputedStyle(c.closest("[style*='opacity']") || c).opacity),
    };
  });

  console.log("Projetos status after nav click:", projetosStatus);
  await browser.close();
}

main().catch(console.error);
