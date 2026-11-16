import { siteData } from "@/data/site";
import { RevealSection } from "@/components/effects/RevealSection";
import { ParallaxWatermark } from "@/components/effects/ParallaxWatermark";

const groups = [
  {
    name: "Sistemas & Baixo Nível",
    badge: "CUDA / C++ / Win32",
    items: siteData.arsenal.filter((a) => a.category === "systems"),
  },
  {
    name: "Frontend & Interfaces",
    badge: "React 19 / TypeScript",
    items: siteData.arsenal.filter((a) => a.category === "frontend"),
  },
  {
    name: "Backend & Engenharia de Mídia",
    badge: "Node.js / Python / Streams",
    items: siteData.arsenal.filter((a) => a.category === "backend"),
  },
  {
    name: "Ferramentas de IA & Automação",
    badge: "Context & Multi-Agent",
    items: siteData.arsenal.filter((a) => a.category === "ai-tools"),
  },
];

export function ToolboxSection() {
  return (
    <section id="arsenal" aria-labelledby="arsenal-heading" className="relative z-10 py-10 sm:py-14 md:py-32 bg-transparent overflow-hidden">
      {/* Parallax Watermark de Fundo */}
      <ParallaxWatermark number="02" label="STACK // ARSENAL TÉCNICO" position="left" speed={55} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <RevealSection variant="blur-fade" duration={0.95}>
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block">
              <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl rotate-[-2deg] block mb-1">
                {"// inventário de combate"}
              </span>
              <h2 id="arsenal-heading" className="font-display text-4xl md:text-6xl text-white tracking-tight">
                ARSENAL TÉCNICO
              </h2>
            </div>
            <p className="text-sm md:text-base text-zinc-400 font-mono mt-2">
              STACK HOMOLOGADA EM AMBIENTE REAL · SEM PLACEHOLDERS
            </p>
          </div>
        </RevealSection>

        {/* Mobile Snap Carousel (< 768px) */}
        <div className="block md:hidden">
          <RevealSection variant="fade-up-soft" delay={0.12} duration={0.85}>
            <p className="text-xs font-mono text-zinc-400 mb-3 flex items-center gap-1.5">
              <span className="text-[#fbbf24]">◀ ▶</span> Deslize para navegar pelas stacks
            </p>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
              {groups.map((g) => (
                <div key={g.name} className="shrink-0 w-[82vw] max-w-[310px] snap-center">
                  <div className="bg-[#141418] border border-zinc-800 p-4 rounded-lg relative overflow-hidden shadow-[4px_4px_0px_#000000] h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-zinc-800">
                        <h3 className="font-display text-lg text-white tracking-wide">{g.name}</h3>
                        <span className="text-[10px] font-mono font-bold text-[#fbbf24] px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded">
                          {g.badge}
                        </span>
                      </div>

                      <ul className="space-y-2.5">
                        {g.items.map((a) => (
                          <li key={a.name} className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-1.5">
                            <span className="font-mono text-xs font-bold text-white">{a.name}</span>
                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                              {a.level}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>

        {/* Desktop Grid (>= 768px) com Entrada Alternada e Microinterações */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {groups.map((g, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <RevealSection
                key={g.name}
                delay={0.12 * idx}
                variant={isLeft ? "fade-left" : "fade-right"}
                duration={0.85}
              >
                <div className="bg-[#141418] border border-zinc-800 p-6 md:p-8 rounded-lg relative overflow-hidden shadow-[4px_4px_0px_#000000] hover:border-[#fbbf24]/70 hover:shadow-[6px_6px_0px_#fbbf24]/30 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800 group-hover:border-zinc-700 transition-colors">
                    <h3 className="font-display text-xl text-white tracking-wide group-hover:text-[#fbbf24] transition-colors">{g.name}</h3>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#fbbf24] px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {g.badge}
                    </span>
                  </div>

                  <ul className="space-y-4">
                    {g.items.map((a) => (
                      <li key={a.name} className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 hover:border-zinc-600 transition-colors">
                        <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#fbbf24] transition-colors" />
                          {a.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {a.level}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
