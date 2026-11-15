import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

// Medições precisas dos gaps no mobile
const measurements = await page.evaluate(() => {
  // 1. Distância entre o Manifesto Card e o título Projetos
  const manifestoCard = Array.from(document.querySelectorAll("#hero div")).find((d) => d.innerText.includes("// MANIFESTO DO CONSTRUTOR"));
  const projetosHeading = document.getElementById("projetos-heading");
  const heroSection = document.getElementById("hero");
  const projetosSection = document.getElementById("projetos");

  const manifestoRect = manifestoCard?.getBoundingClientRect();
  const heroBottom = heroSection?.offsetTop + heroSection?.offsetHeight;
  const projetosTop = projetosSection?.offsetTop;

  // 2. Distância entre final da Jornada e título Princípios
  const jornadaSection = document.getElementById("jornada");
  const principiosHeading = document.getElementById("principios-heading");
  const principiosSection = document.getElementById("principios");

  const jornadaBottom = jornadaSection?.offsetTop + jornadaSection?.offsetHeight;
  const principiosTop = principiosSection?.offsetTop;

  // 3. Distância entre final de Arsenal e Jornada
  const arsenalSection = document.getElementById("arsenal");
  const arsenalBottom = arsenalSection?.offsetTop + arsenalSection?.offsetHeight;
  const jornadaTop = jornadaSection?.offsetTop;

  return {
    heroToProjetosGapPx: projetosTop - heroBottom,
    manifestoBottom: manifestoRect?.bottom,
    arsenalToJornadaGapPx: jornadaTop - arsenalBottom,
    jornadaToPrincipiosGapPx: principiosTop - jornadaBottom,
  };
});

console.log("Medições dos gaps mobile:", JSON.stringify(measurements, null, 2));

// Capturas de tela nos pontos exatos das fotos do usuário
const destDir = "C:\\Users\\thiag\\OpenBot\\Agents\\agent-028933d6-210f-4a1f-9d79-521fdc4549da\\mobile-mitigation-screenshots";
fs.mkdirSync(destDir, { recursive: true });

// Foto 1: Transição Manifesto -> Projetos
await page.evaluate(() => {
  const manifesto = Array.from(document.querySelectorAll("#hero div")).find((d) => d.innerText.includes("// MANIFESTO DO CONSTRUTOR"));
  if (manifesto) {
    const y = manifesto.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "instant" });
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(destDir, "after-manifesto-projetos.png") });

// Foto 2: Transição Jornada -> Princípios
await page.evaluate(() => {
  const principios = document.getElementById("principios");
  if (principios) {
    const y = principios.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: y, behavior: "instant" });
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(destDir, "after-jornada-principios.png") });

await browser.close();
