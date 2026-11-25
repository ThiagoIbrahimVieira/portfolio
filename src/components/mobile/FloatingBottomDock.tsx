"use client";

import { useEffect, useState } from "react";
import { Terminal, Layers, Cpu, Compass } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

interface DockItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

const dockItems: DockItem[] = [
  { id: "hero", label: "Início", href: "#hero", icon: Terminal },
  { id: "projetos", label: "Projetos", href: "#projetos", icon: Layers },
  { id: "arsenal", label: "Stack", href: "#arsenal", icon: Cpu },
  { id: "jornada", label: "Log", href: "#jornada", icon: Compass },
  { id: "github", label: "Code", href: "https://github.com/ThiagoIbrahimVieira", icon: GithubIcon, isExternal: true },
];

export function FloatingBottomDock() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "projetos", "arsenal", "jornada"];
      const scrollY = window.scrollY + window.innerHeight * 0.35;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActive(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDockClick = (e: React.MouseEvent<HTMLAnchorElement>, item: DockItem) => {
    if (item.isExternal) return;
    const el = document.getElementById(item.id);
    if (!el) return;
    e.preventDefault();
    setActive(item.id);
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, y), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <aside
      aria-label="Navegação móvel tátil"
      className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] inset-x-4 z-50 mx-auto max-w-sm md:hidden"
    >
      <nav className="flex items-center justify-between gap-2 bg-[#141418]/95 backdrop-blur-md p-2 border-[1.5px] border-white/80 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleDockClick(e, item)}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              className={`min-w-[48px] min-h-[44px] flex flex-col items-center justify-center rounded-xl px-2 py-1 text-xs font-mono transition-transform active:scale-90 touch-manipulation ${
                isActive && !item.isExternal
                  ? "bg-[#fbbf24] text-black font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.45),2px_2px_0px_#000000]"
                  : "text-white/75 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
