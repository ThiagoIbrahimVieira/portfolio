import Image from "next/image";
import { siteData } from "@/data/site";
import { RevealSection } from "@/components/effects/RevealSection";

export function JournalSection() {
  return (
    <section id="jornada" aria-labelledby="jornada-heading" className="relative z-10 py-12 md:py-20 bg-transparent scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <RevealSection>
          <div className="text-center mb-8 md:mb-12">
            <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl block mb-2">
              {"// log de evolução contínua"}
            </span>
            <h2 id="jornada-heading" className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-tight">
              JORNADA DE ENGENHARIA
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/65 font-mono mt-2">
              DE CONSUMIDOR DE FERRAMENTAS A CONSTRUTOR DE SISTEMAS · ETEC ITAPEVI (1º TÉCNICO EM INFORMÁTICA)
            </p>
          </div>
        </RevealSection>

        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Coluna da Linha do Tempo */}
          <div className="lg:col-span-7 min-w-0">
            <RevealSection delay={0.15}>
              <div className="bg-[#141418] border border-zinc-800 rounded-2xl p-6 relative shadow-[0_12px_28px_rgba(0,0,0,0.45),4px_4px_0px_#000000] min-w-0">
                {/* Tape on top */}
                <div className="tape-strip top-[-10px] left-12 w-28" />

                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-800">
                  <span className="w-9 h-9 rounded-full bg-[#fbbf24] text-black font-display text-lg flex items-center justify-center font-bold shrink-0">
                    TT
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-zinc-400 uppercase truncate">DIÁRIO DE BORDO DO CONSTRUTOR</p>
                    <p className="text-xs text-zinc-500 font-mono truncate">ETEC Itapevi · 1º Técnico em Informática</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-4.5">
                  {siteData.journey.map((j, i) => (
                    <RevealSection key={j.year} delay={0.08 * i} variant="slide-left">
                      <div className="flex gap-4 items-start group">
                        <div className="flex flex-col items-center shrink-0">
                          <span className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 text-[#fbbf24] group-hover:border-amber-400 font-mono text-xs flex items-center justify-center font-bold shadow-[2px_2px_0px_#000000] transition-colors">
                            {i + 1}
                          </span>
                          {i < siteData.journey.length - 1 && (
                            <div className="w-[1.5px] h-12 bg-gradient-to-b from-amber-400/50 to-zinc-800 my-1" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#fbbf24] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                              {j.year}
                            </span>
                            {j.title && (
                              <span className="font-display text-base text-white group-hover:text-amber-300 transition-colors">{j.title}</span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                            {j.description}
                          </p>
                        </div>
                      </div>
                    </RevealSection>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>

          {/* Coluna da Foto de Perfil / Trajetória */}
          <div className="lg:col-span-5 flex flex-col items-center min-w-0 w-full">
            <RevealSection delay={0.25} variant="scale-up" className="w-full max-w-[250px] sm:max-w-[300px] lg:max-w-sm mx-auto">
              <div className="w-full bg-[#141418] border-2 border-zinc-700 rounded-xl p-4 sm:p-5 relative shadow-[6px_6px_0px_#000000] min-w-0">
                <div className="tape-strip top-[-10px] right-8 w-44 bg-amber-500/30 text-amber-200 border-amber-400/50 text-center flex items-center justify-center font-mono text-[10px] font-bold">
                  AUTOR // 1º TÉCNICO EM INFORMÁTICA
                </div>

                <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-zinc-700 shadow-inner mb-4 bg-zinc-950 group">
                  <Image
                    src="/images/thiago-about.png"
                    alt="Thiago Ibrahim Vieira — 1º Técnico em Informática na ETEC de Itapevi"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-xl sm:text-2xl text-white">THIAGO IBRAHIM VIEIRA</h3>
                  <p className="font-mono text-[11px] sm:text-xs text-[#fbbf24]">15 ANOS · ETEC DE ITAPEVI · 1º TÉCNICO EM INFORMÁTICA</p>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed italic pt-1.5 border-t border-zinc-800">
                    &ldquo;Eu releio e audito todo código que os agentes geram. IA é braço de engenharia, nunca substituto do raciocínio humano.&rdquo;
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}
