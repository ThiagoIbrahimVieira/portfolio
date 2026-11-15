import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await context.newPage();

await page.goto("https://portifolio-thiago-ibrahim.vercel.app/", { waitUntil: "networkidle" });
await page.locator("#contato").scrollIntoViewIfNeeded();

// Preenche dados válidos
await page.fill("#contato input#nome", "Steve Rogers QA");
await page.fill("#contato input#email", "qa.steve@shield.org");
await page.fill("#contato textarea#msg", "Homologação de qualidade de ponta a ponta.");

// Intercepta requisição de rede para /api/contact
let contactReq = null;
let contactRes = null;

page.on("request", (req) => {
  if (req.url().includes("/api/contact")) {
    contactReq = { url: req.url(), method: req.method(), postData: req.postData() };
  }
});

page.on("response", async (res) => {
  if (res.url().includes("/api/contact")) {
    contactRes = { status: res.status(), statusText: res.statusText(), body: await res.text().catch(() => "") };
  }
});

const mailBtn = page.locator('#contato button[type="submit"]').first();
await mailBtn.click();
await page.waitForTimeout(2000);

console.log("Request:", JSON.stringify(contactReq));
console.log("Response:", JSON.stringify(contactRes));

const statusCard = await page.evaluate(() => {
  const err = document.querySelector("#contato div.bg-red-950\\/70");
  const succ = document.querySelector("#contato div.bg-emerald-950\\/70");
  return {
    errVisible: !!err,
    errText: err?.innerText?.trim(),
    succVisible: !!succ,
    succText: succ?.innerText?.trim(),
  };
});

console.log("Status Card:", JSON.stringify(statusCard));

await browser.close();
