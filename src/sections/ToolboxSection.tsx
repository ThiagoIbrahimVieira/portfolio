import { siteData } from "@/data/site";
import { RevealSection } from "@/components/effects/RevealSection";

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
    <section id="arsenal" aria-labelledby="arsenal-heading" className="relative z-10 py-24 md:py-32 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <RevealSection>
          <div className="text-center mb-16">
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
          <p className="text-xs font-mono text-zinc-400 mb-3 flex items-center gap-1.5">
            <span className="text-[#fbbf24]">◀ ▶</span> Deslize para navegar pelas stacks
          </p>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none touch-pan-x overscroll-x-contain">
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
        </div>

        {/* Desktop Grid (>= 768px) */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {groups.map((g, idx) => (
            <RevealSection key={g.name} delay={0.12 * idx} variant="scale-up">
              <div className="bg-[#141418] border border-zinc-800 p-6 md:p-8 rounded-lg relative overflow-hidden shadow-[4px_4px_0px_#000000] hover:border-zinc-600 transition-colors">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
                  <h3 className="font-display text-xl text-white tracking-wide">{g.name}</h3>
                  <span className="text-[11px] font-mono font-bold text-[#fbbf24] px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded">
                    {g.badge}
                  </span>
                </div>

                <ul className="space-y-4">
                  {g.items.map((a) => (
                    <li key={a.name} className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2">
                      <span className="font-mono text-sm font-bold text-white">{a.name}</span>
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {a.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
