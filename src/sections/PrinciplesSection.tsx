import { siteData } from "@/data/site";
import { ShieldCheck, Cpu, Eye, HardDrive } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

const icons = [ShieldCheck, Eye, Cpu, HardDrive];

export function PrinciplesSection() {
  return (
    <section id="principios" aria-labelledby="principios-heading" className="relative z-10 py-24 md:py-32 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <div className="text-center mb-16">
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

          <div className="grid sm:grid-cols-2 gap-6">
            {siteData.principles.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <RevealSection key={p.id} delay={0.12 * i} variant="scale-up">
                  <div
                    className="bg-[#141418] border border-zinc-800 p-6 rounded-lg relative shadow-[4px_4px_0px_#000000] hover:border-zinc-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#fbbf24] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl text-white mb-2">{p.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-sans">{p.description}</p>
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
