"use client";

import { useEffect, useRef } from "react";
import { siteData } from "@/data/site";
import { ShieldCheck, Cpu, Eye, HardDrive } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";
import { ParallaxWatermark } from "@/components/effects/ParallaxWatermark";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const icons = [ShieldCheck, Eye, Cpu, HardDrive];

export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 640px)", () => {
        const cards = document.querySelectorAll(".principle-desktop-card");
        if (cards.length > 0) {
          cards.forEach((card, i) => {
            const isLeft = i % 2 === 0;
            gsap.fromTo(
              card,
              { x: isLeft ? -50 : 50, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.1 * i,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );

            // Icon pop on entry
            const iconBox = card.querySelector(".principle-icon-box");
            if (iconBox) {
              gsap.fromTo(
                iconBox,
                { scale: 0.6, rotate: -12 },
                {
                  scale: 1,
                  rotate: 0,
                  duration: 0.5,
                  delay: 0.15 * i + 0.15,
                  ease: "back.out(2)",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none",
                  },
                }
              );
            }
          });
        }
      });
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      id="principios"
      ref={sectionRef}
      aria-labelledby="principios-heading"
      className="relative z-10 py-10 sm:py-14 md:py-32 bg-transparent overflow-hidden"
    >
      {/* Parallax Watermark de Fundo */}
      <ParallaxWatermark number="04" label="RULES // PRINCÍPIOS NUCLEARES" position="left" speed={55} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <RevealSection variant="blur-fade" duration={0.95}>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl block mb-1">
                {"// governança inegociável"}
              </span>
              <h2 id="principios-heading" className="font-display text-4xl md:text-6xl text-white tracking-tight">
                PRINCÍPIOS DE CONSTRUÇÃO
              </h2>
              <p className="text-sm md:text-base text-zinc-400 font-mono mt-2">
                PADRÕES DE ENGENHARIA APLICADOS EM CADA LINHA DE CÓDIGO
              </p>
            </div>
          </RevealSection>

          {/* Mobile Snap Carousel (< 640px) */}
          <div className="block sm:hidden">
            <RevealSection variant="fade-up-soft" delay={0.12} duration={0.85}>
              <p className="text-xs font-mono text-zinc-400 mb-3 flex items-center gap-1.5">
                <span className="text-[#fbbf24]">◀ ▶</span> Deslize para navegar pelos princípios
              </p>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
                {siteData.principles.map((p, i) => {
                  const Icon = icons[i % icons.length];
                  return (
                    <div key={p.id} className="shrink-0 w-[80vw] max-w-[280px] snap-center">
                      <div className="bg-[#141418] border border-zinc-800 p-4 rounded-lg relative shadow-[4px_4px_0px_#000000] h-full flex flex-col justify-between">
                        <div>
                          <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#fbbf24] mb-3">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="font-display text-lg text-white mb-1.5">{p.title}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{p.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealSection>
          </div>

          {/* Desktop Grid (>= 640px) com Entrada Alternada GSAP ScrollTrigger e Microinterações */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-6">
            {siteData.principles.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={p.id}
                  className="principle-desktop-card bg-[#141418] border border-zinc-800 p-6 rounded-lg relative shadow-[4px_4px_0px_#000000] hover:border-[#fbbf24]/70 hover:shadow-[6px_6px_0px_#fbbf24]/30 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="principle-icon-box w-10 h-10 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#fbbf24] mb-4 group-hover:scale-110 group-hover:border-[#fbbf24] transition-all">
                    <Icon className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-2 group-hover:text-[#fbbf24] transition-colors">{p.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
