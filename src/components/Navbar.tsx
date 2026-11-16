"use client";

import { useEffect, useState } from "react";
import { animate } from "animejs";
import { siteData } from "@/data/site";
import { ArrowUpRight } from "lucide-react";

const links = [
  { href: "#projetos", label: "Projetos" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#jornada", label: "Jornada" },
  { href: "#principios", label: "Princípios" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ["hero", "projetos", "arsenal", "jornada", "principios", "contato"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex items-center justify-between gap-6">
        <a
          href="#hero"
          className="font-display text-2xl tracking-tight text-white hover:text-[#fbbf24] transition-colors flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded bg-[#fbbf24] text-black font-bold flex items-center justify-center text-sm shadow-[2px_2px_0px_#ffffff]">
            TT
          </span>
          <span className="hidden sm:inline">THIAGO IBRAHIM PORTIFOLIO</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                if (l.href.startsWith("#")) {
                  e.preventDefault();
                  const target = document.getElementById(l.href.slice(1));
                  if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 80;
                    const scrollElement = document.scrollingElement || document.documentElement || document.body;
                    animate(scrollElement, {
                      scrollTop: y,
                      duration: 700,
                      ease: "outExpo",
                    });
                  }
                }
              }}
              className={`text-xs font-mono uppercase tracking-wider transition-colors ${
                active === l.href.slice(1)
                  ? "text-[#fbbf24] font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={siteData.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono uppercase font-bold bg-[#fbbf24] text-black px-4 py-2 rounded border border-black shadow-[2px_2px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5"
        >
          GITHUB
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
