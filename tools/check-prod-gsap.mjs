async function check() {
  const html = await fetch("https://portifolio-thiago-ibrahim.vercel.app/").then(r => r.text());
  const regex = /src="([^"]+\.js)"/g;
  let match;
  const scripts = [];
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  console.log("Total script tags found:", scripts.length);
  for (const s of scripts) {
    const url = s.startsWith("http") ? s : "https://portifolio-thiago-ibrahim.vercel.app" + s;
    const js = await fetch(url).then(r => r.text());
    const hasGsap = js.includes("gsap") || js.includes("ScrollTrigger");
    console.log(s, "-> Has GSAP/ScrollTrigger:", hasGsap, "Size:", js.length);
  }
}
check().catch(console.error);
