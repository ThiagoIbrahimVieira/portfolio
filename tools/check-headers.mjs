async function check() {
  const res = await fetch("https://portifolio-thiago-ibrahim.vercel.app/");
  console.log("Status:", res.status);
  console.log("x-vercel-id:", res.headers.get("x-vercel-id"));
  console.log("x-matched-path:", res.headers.get("x-matched-path"));
  const html = await res.text();
  const buildIdMatch = html.match(/"buildId":"([^"]+)"/);
  console.log("BuildId:", buildIdMatch ? buildIdMatch[1] : "not found");
  // Check if our commit string or text exists in html
  console.log("Contains '4 obras reais':", html.includes("4 obras reais"));
  console.log("Contains 'hero-title-line':", html.includes("hero-title-line"));
}

check().catch(console.error);
