import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

async function checkRevealDivs() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });

  const divs = await page.evaluate(() => {
    // Look at all divs created by RevealSection or containing text PROJETOS NUCLEARES
    const h2 = document.querySelector("#projetos-heading");
    const revealDiv = h2?.closest("#projetos")?.querySelector("div > div");
    
    // Check all ScrollTrigger instances
    const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
      triggerTag: st.trigger?.tagName,
      triggerClass: st.trigger?.className,
      start: st.start,
      end: st.end,
      isActive: st.isActive,
      progress: st.progress
    })) : "NO_SCROLLTRIGGER_GLOBAL";

    // Check gsap version on window
    return {
      revealDivTag: revealDiv?.tagName,
      revealDivClass: revealDiv?.className,
      revealDivStyle: revealDiv?.getAttribute("style"),
      revealDivComputedOpacity: revealDiv ? window.getComputedStyle(revealDiv).opacity : null,
      revealDivComputedTransform: revealDiv ? window.getComputedStyle(revealDiv).transform : null,
      triggers,
      lenis: typeof window.__lenis
    };
  });

  console.log("Details on Projetos Header:", JSON.stringify(divs, null, 2));

  await browser.close();
}

checkRevealDivs().catch(console.error);
