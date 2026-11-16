import Image from "next/image";
import { siteData } from "@/data/site";
import { RevealSection } from "@/components/effects/RevealSection";

export function JournalSection() {
  return (
    <section id="jornada" aria-labelledby="jornada-heading" className="relative z-10 py-14 md:py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <RevealSection>
          <div className="text-center mb-10">
            <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl block mb-1">
              {"// log de evolução contínua"}
            </span>
            <h2 id="jornada-heading" className="font-display text-4xl md:text-6xl text-white tracking-tight">
              JORNADA DE ENGENHARIA
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-mono mt-2">
              DE CONSUMIDOR DE FERRAMENTAS A CONSTRUTOR DE SISTEMAS · ETEC ITAPEVI (1º TÉCNICO EM INFORMÁTICA)
            </p>
          </div>
        </RevealSection>

        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Coluna da Linha do Tempo */}
          <div className="lg:col-span-7">
            <RevealSection delay={0.15}>
              <div className="bg-[#141418] border border-zinc-800 rounded-lg p-6 md:p-8 relative shadow-[4px_4px_0px_#000000]">
                {/* Tape on top */}
                <div className="tape-strip top-[-10px] left-12 w-28" />

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                  <span className="w-10 h-10 rounded-full bg-[#fbbf24] text-black font-display text-xl flex items-center justify-center font-bold">
                    TT
                  </span>
                  <div>
                    <p className="font-mono text-xs text-zinc-400 uppercase">DIÁRIO DE BORDO DO CONSTRUTOR</p>
                    <p className="text-xs text-zinc-500 font-mono">ETEC Itapevi · 1º Técnico em Informática</p>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-7">
                  {siteData.journey.map((j, i) => (
                    <RevealSection key={j.year} delay={0.08 * i} variant="slide-left">
                      <div className="flex gap-4 items-start">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 text-[#fbbf24] font-mono text-xs flex items-center justify-center font-bold shadow-[2px_2px_0px_#000000]">
                            {i + 1}
                          </span>
                          {i < siteData.journey.length - 1 && (
                            <div className="w-[1.5px] h-12 bg-gradient-to-b from-amber-400/50 to-zinc-800 my-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#fbbf24] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                              {j.year}
                            </span>
                            {j.title && (
                              <span className="font-display text-base text-white">{j.title}</span>
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
          <div className="lg:col-span-5 flex flex-col items-center">
            <RevealSection delay={0.25}>
              <div className="w-full bg-[#141418] border-2 border-zinc-700 rounded-xl p-6 relative shadow-[6px_6px_0px_#000000]">
                <div className="tape-strip top-[-10px] right-8 w-44 bg-amber-500/30 text-amber-200 border-amber-400/50 text-center flex items-center justify-center font-mono text-[10px] font-bold">
                  AUTOR // 1º TÉCNICO EM INFORMÁTICA
                </div>

                <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-zinc-700 shadow-inner mb-6 bg-zinc-950">
                  <Image
                    src="/images/thiago-about.png"
                    alt="Thiago Ibrahim Vieira — 1º Técnico em Informática na ETEC de Itapevi"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl text-white">THIAGO IBRAHIM VIEIRA</h3>
                  <p className="font-mono text-xs text-[#fbbf24]">16 ANOS · ETEC DE ITAPEVI · 1º TÉCNICO EM INFORMÁTICA</p>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed italic pt-2 border-t border-zinc-800">
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
