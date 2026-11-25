"use client";

import { useEffect, useState } from "react";
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
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -45% 0px" }
    );
    ["hero", "projetos", "arsenal", "jornada", "principios", "contato"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setActive(id);
    const offset = window.innerWidth < 768 ? -64 : -80;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string, opts?: { offset?: number }) => void } }).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(el, { offset });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 py-2 md:py-4 flex items-center justify-between gap-3 md:gap-6">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="font-display text-lg sm:text-xl md:text-2xl tracking-tight text-white hover:text-[#fbbf24] transition-colors flex items-center gap-2 min-w-0 min-h-[38px] md:min-h-[44px]"
        >
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fbbf24] text-black font-bold flex items-center justify-center text-xs sm:text-sm shadow-[2px_2px_0px_#ffffff] shrink-0">
            TT
          </span>
          <span className="hidden sm:inline truncate">
            THIAGO IBRAHIM <span className="hidden lg:inline">PORTFOLIO</span>
          </span>
        </a>

        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={`relative py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-[#fbbf24] font-bold after:absolute after:left-0 after:right-0 after:bottom-0.5 after:h-0.5 after:bg-[#fbbf24] after:rounded-full"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {siteData.contact.linkedin && (
            <a
              href={siteData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[38px] sm:min-h-[44px] text-[11px] sm:text-xs font-mono uppercase font-bold bg-[#0a66c2] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),2px_2px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-[transform,box-shadow] duration-150 flex items-center gap-1.5"
            >
              LINKEDIN
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={siteData.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] sm:min-h-[44px] text-[11px] sm:text-xs font-mono uppercase font-bold bg-[#fbbf24] text-black px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),2px_2px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-[transform,box-shadow] duration-150 flex items-center gap-1.5"
          >
            GITHUB
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
