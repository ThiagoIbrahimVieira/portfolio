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
  { id: "github", label: "Code", href: "https://github.com/thiago-ibrahim", icon: GithubIcon, isExternal: true },
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
