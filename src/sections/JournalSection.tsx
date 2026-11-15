import Image from "next/image";
import { siteData } from "@/data/site";
import { RevealSection } from "@/components/effects/RevealSection";
import { ParallaxWatermark } from "@/components/effects/ParallaxWatermark";

export function JournalSection() {
  return (
    <section id="jornada" aria-labelledby="jornada-heading" className="relative z-10 py-10 sm:py-14 md:py-32 bg-transparent overflow-hidden">
      {/* Parallax Watermark de Fundo */}
      <ParallaxWatermark number="03" label="LOG // JORNADA DO CONSTRUTOR" position="right" speed={55} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <RevealSection>
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
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
              <div className="bg-[#141418] border border-zinc-800 rounded-lg p-4 sm:p-6 md:p-10 relative shadow-[4px_4px_0px_#000000] overflow-visible">
                {/* Tape on top right, tilted */}
                <div className="tape-strip -top-3.5 -right-3 w-28 bg-[#fbbf24]/50 text-black text-center flex items-center justify-center font-mono text-[9px] font-bold z-20 rotate-[5deg] shadow-md border border-black/30">
                  ETEC // LOG
                </div>

                {/* Mobile/Tablet Compact Author Header (Texto no esquerdo, Foto no lado direito) */}
                <div className="flex lg:hidden items-center justify-between gap-3 p-3.5 sm:p-4 mb-6 bg-zinc-900/90 border border-zinc-700/80 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono font-bold text-[#fbbf24] px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded inline-block mb-1">
                      AUTOR · 16 ANOS
                    </span>
                    <h3 className="font-display text-base sm:text-lg text-white truncate">THIAGO IBRAHIM VIEIRA</h3>
                    <p className="font-mono text-[10px] sm:text-xs text-zinc-400 mb-1">ETEC Itapevi · 1º Técnico em Informática</p>
                    <p className="font-sans text-[11px] sm:text-xs text-zinc-300 leading-snug line-clamp-2 italic">
                      &ldquo;IA é braço de engenharia, nunca substituto do raciocínio humano.&rdquo;
                    </p>
                  </div>
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-md overflow-hidden border border-zinc-700 bg-zinc-950">
                    <Image
                      src="/images/thiago-about.png"
                      alt="Thiago Ibrahim Vieira — 1º Técnico em Informática"
                      fill
                      sizes="(max-width: 640px) 80px, 100px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-zinc-800">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fbbf24] text-black font-display text-lg sm:text-xl flex items-center justify-center font-bold shrink-0">
                    TT
                  </span>
                  <div>
                    <p className="font-mono text-xs text-zinc-400 uppercase">DIÁRIO DE BORDO DO CONSTRUTOR</p>
                    <p className="text-[11px] sm:text-xs text-zinc-500 font-mono">ETEC Itapevi · 1º Técnico em Informática</p>
                  </div>
                </div>

                <div className="space-y-5 md:space-y-8">
                  {siteData.journey.map((j, i) => (
                    <RevealSection key={j.year} delay={0.08 * i} variant="slide-left">
                      <div className="flex gap-3 sm:gap-4 items-start">
                        <div className="flex flex-col items-center">
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-900 border border-zinc-700 text-[#fbbf24] font-mono text-[11px] sm:text-xs flex items-center justify-center font-bold shadow-[2px_2px_0px_#000000]">
                            {i + 1}
                          </span>
                          {i < siteData.journey.length - 1 && (
                            <div className="w-[1.5px] h-10 sm:h-12 bg-gradient-to-b from-amber-400/50 to-zinc-800 my-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#fbbf24] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                              {j.year}
                            </span>
                            {j.title && (
                              <span className="font-display text-sm sm:text-base text-white">{j.title}</span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
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

          {/* Coluna da Foto de Perfil / Trajetória (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center">
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
