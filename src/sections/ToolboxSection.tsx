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
    <section id="arsenal" aria-labelledby="arsenal-heading" className="relative z-10 py-12 md:py-20 bg-transparent scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <RevealSection>
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block">
              <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl rotate-[-2deg] block mb-2">
                {"// inventário de combate"}
              </span>
              <h2 id="arsenal-heading" className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-tight">
                ARSENAL TÉCNICO
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-white/65 font-mono mt-2">
              STACK HOMOLOGADA EM AMBIENTE REAL · SEM PLACEHOLDERS
            </p>
          </div>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {groups.map((g, idx) => (
            <RevealSection key={g.name} delay={0.12 * idx} variant="scale-up" className="min-w-0">
              <div className="bg-[#141418] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.45),4px_4px_0px_#000000] hover:border-zinc-500 hover:shadow-[4px_4px_0px_#fbbf24] transition-all duration-200 group min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2.5 border-b border-zinc-800">
                  <h3 className="font-display text-xl text-white tracking-wide group-hover:text-amber-300 transition-colors min-w-0 truncate">{g.name}</h3>
                  <span className="text-[11px] font-mono font-bold text-[#fbbf24] px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded shrink-0">
                    {g.badge}
                  </span>
                </div>

                <ul className="space-y-3">
                  {g.items.map((a) => (
                    <li key={a.name} className="flex flex-col gap-1 border-b border-zinc-800/60 pb-2.5 hover:border-zinc-700 transition-colors group/item min-w-0">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="font-mono text-sm font-bold text-white group-hover/item:text-[#fbbf24] group-hover/item:translate-x-1 transition-all inline-block min-w-0">
                          {a.name}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0" />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 leading-relaxed break-words">
                        {a.level}
                      </p>
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
