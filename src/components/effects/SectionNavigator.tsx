"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown, ArrowUp } from "lucide-react";

export interface SectionDef {
  id: string;
  number: string;
  label: string;
  short: string;
}

export const SECTIONS: SectionDef[] = [
  { id: "hero", number: "01", label: "01 // HERO", short: "HERO" },
  { id: "projetos", number: "02", label: "02 // PROJETOS", short: "PROJETOS" },
  { id: "arsenal", number: "03", label: "03 // ARSENAL", short: "ARSENAL" },
  { id: "jornada", number: "04", label: "04 // JORNADA", short: "JORNADA" },
  { id: "principios", number: "05", label: "05 // PRINCÍPIOS", short: "PRINCÍPIOS" },
  { id: "contato", number: "06", label: "06 // CONTATO", short: "CONTATO" },
];

export function SectionNavigator() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  // Oculta completamente quando algum modal estiver aberto
  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.body.style.overflow === "hidden");
    };
    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  // Sincronização 100% estável via IntersectionObserver (Zero bugs de cálculo manual)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) {
              setActiveIdx(idx);
            }
          }
        });
      },
      {
        rootMargin: "-30% 0px -40% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Rola suavemente até a seção desejada compensando o Navbar (offset: -80)
  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    const targetId = SECTIONS[index].id;
    const element = document.getElementById(targetId);
    if (!element) return;

    setActiveIdx(index);

    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string, opts?: { offset?: number }) => void } }).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(element, { offset: -80 });
    } else {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // Avança para a próxima seção (ou volta ao topo)
  const handleNextSection = () => {
    if (activeIdx >= SECTIONS.length - 1) {
      scrollToSection(0);
    } else {
      scrollToSection(activeIdx + 1);
    }
  };

  if (isModalOpen) return null;

  const isLast = activeIdx === SECTIONS.length - 1;

  return (
    <aside
      aria-label="Navegação rápida de seções"
      className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 p-1.5 rounded-full bg-zinc-950/85 backdrop-blur-md border border-zinc-800 shadow-[3px_3px_0px_#000000] select-none pointer-events-auto transition-all"
    >
      {/* Indicadores Minimalistas das 6 Seções */}
      <div className="flex flex-col items-center gap-1.5">
        {SECTIONS.map((sec, idx) => {
          const isActive = idx === activeIdx;
          const isHovered = hoveredDot === idx;

          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(idx)}
              onMouseEnter={() => setHoveredDot(idx)}
              onMouseLeave={() => setHoveredDot(null)}
              aria-label={`Ir para a seção ${sec.label}`}
              className="group relative flex items-center justify-center p-1 cursor-pointer transition-transform active:scale-90"
            >
              {/* Tooltip flutuante à esquerda com o nome da seção no hover */}
              {isHovered && (
                <span className="absolute right-full mr-3.5 px-2.5 py-1 bg-black/95 text-zinc-100 font-mono text-[10px] font-bold border border-zinc-700 rounded shadow-[2px_2px_0px_#000000] whitespace-nowrap pointer-events-none flex items-center gap-1.5 z-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                  {sec.label}
                </span>
              )}

              {/* Indicador Visual do Marcador */}
              {isActive ? (
                <span className="w-2 h-4 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24] transition-all duration-200" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-zinc-300 transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-3.5 h-[1px] bg-zinc-800 my-0.5" />

      {/* Botão Miniatura NEXT / TOPO Discreto */}
      <button
        onClick={handleNextSection}
        title={isLast ? "Voltar ao topo" : "Avançar para a próxima seção"}
        className="p-1 rounded-full text-zinc-400 hover:text-[#fbbf24] hover:bg-zinc-900 transition-colors cursor-pointer active:scale-90"
      >
        {isLast ? (
          <ArrowUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
