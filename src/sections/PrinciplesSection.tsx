import { siteData } from "@/data/site";
import { ShieldCheck, Cpu, Eye, HardDrive } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

const icons = [ShieldCheck, Eye, Cpu, HardDrive];

export function PrinciplesSection() {
  return (
    <section id="principios" aria-labelledby="principios-heading" className="relative z-10 py-8 md:py-14 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="text-center mb-6 md:mb-8">
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

          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {siteData.principles.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <RevealSection key={p.id} delay={0.12 * i} variant="scale-up" className="min-w-0">
                  <div
                    className="bg-[#141418] border border-zinc-800 p-4 sm:p-5 rounded-lg relative shadow-[4px_4px_0px_#000000] hover:border-zinc-500 hover:shadow-[4px_4px_0px_#fbbf24] transition-all duration-200 group min-w-0 h-full flex flex-col"
                  >
                    <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-700 group-hover:border-amber-400/60 flex items-center justify-center text-[#fbbf24] mb-3 transition-colors shrink-0">
                      <Icon className="w-4.5 h-4.5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl text-white mb-1.5 group-hover:text-amber-300 transition-colors min-w-0">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans flex-1">{p.description}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
