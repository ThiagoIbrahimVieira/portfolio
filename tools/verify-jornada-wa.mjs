import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await context.newPage();

await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });

// 1. Verificar imagem da Jornada após rolar
await page.locator("#jornada").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);

const imgState = await page.evaluate(() => {
  const img = document.querySelector("#jornada .flex.lg\\:hidden img");
  return {
    exists: !!img,
    complete: img?.complete,
    naturalWidth: img?.naturalWidth,
    naturalHeight: img?.naturalHeight,
    src: img?.src,
  };
});
console.log("Jornada imgState:", JSON.stringify(imgState));

// 2. Verificar WhatsApp window.open
await page.locator("#contato").scrollIntoViewIfNeeded();
await page.fill("#contato input#nome", "Steve Rogers");
await page.fill("#contato input#email", "steve@avengers.org");
await page.fill("#contato textarea#msg", "Teste de homologação QA");

await page.evaluate(() => {
  window.__openedUrls = [];
  window.open = (url) => { window.__openedUrls.push(url); return null; };
});

const waBtn = page.locator('#contato button:has-text("WHATSAPP")').first();
await waBtn.click();
await page.waitForTimeout(500);

const opened = await page.evaluate(() => window.__openedUrls);
console.log("Opened URLs:", JSON.stringify(opened));

// 3. Verificar status do formulário após envio
const statusState = await page.evaluate(() => {
  const successWa = document.querySelector("#contato div.bg-emerald-950\\/70");
  return {
    successWaVisible: !!successWa,
    text: successWa?.innerText?.trim(),
  };
});
console.log("Status State:", JSON.stringify(statusState));

// 4. Testar envio de e-mail com campos vazios e preenchidos
const mailBtn = page.locator('#contato button[type="submit"]').first();
// Limpar campos
await page.fill("#contato input#nome", "");
await mailBtn.click();
await page.waitForTimeout(300);
const errNome = await page.evaluate(() => document.querySelector("#contato div.bg-red-950\\/70")?.innerText?.trim());
console.log("Erro Nome Vazio:", errNome);

await page.fill("#contato input#nome", "Steve Rogers");
await page.fill("#contato input#email", "email-invalido");
await mailBtn.click();
await page.waitForTimeout(300);
// Como tem type="email", o browser HTML5 ou o validate() valida
const errEmail = await page.evaluate(() => document.querySelector("#contato div.bg-red-950\\/70")?.innerText?.trim());
console.log("Erro Email:", errEmail);

await browser.close();
