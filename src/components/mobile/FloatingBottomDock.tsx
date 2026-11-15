"use client";

import { useEffect, useState } from "react";
import { animate } from "animejs";
import { Terminal, Layers, Cpu, Compass } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { siteData } from "@/data/site";

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
  { id: "github", label: "Code", href: siteData.contact.github, icon: GithubIcon, isExternal: true },
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

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal?: boolean) => {
    if (isExternal || !href.startsWith("#")) return;
    e.preventDefault();
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    setActive(targetId);
    const y = target.getBoundingClientRect().top + window.scrollY - 70;
    const scrollElement = document.scrollingElement || document.documentElement || document.body;
    animate(scrollElement, {
      scrollTop: y,
      duration: 650,
      ease: "outExpo",
    });
  };

  return (
    <aside
      aria-label="Navegação móvel tátil"
      className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-sm md:hidden"
    >
      <nav className="flex items-center justify-between gap-1 bg-[#141418]/95 backdrop-blur-md px-3 py-2 border-[1.5px] border-white/80 rounded-xl shadow-[3px_4px_0px_#000000,0_10px_25px_rgba(0,0,0,0.8)]">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.href, item.isExternal)}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center rounded-lg px-2 py-1 text-xs font-mono transition-transform active:scale-90 touch-manipulation ${
                isActive && !item.isExternal
                  ? "bg-[#fbbf24] text-black font-bold shadow-[1.5px_2px_0px_#000000]"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
