"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { siteData } from "@/data/site";
import { Terminal, ArrowUpRight, Cpu, Code2 } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ParallaxWatermark } from "@/components/effects/ParallaxWatermark";
import { gsap } from "@/lib/gsap";

export function HeroSection() {
  const [time, setTime] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Parallax para o Hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const stickerY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 44]);
  const sealY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 68]);
  const manifestY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 24]);
  const titleY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -16]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 1000);

    // GSAP Hero Unified Master Timeline & Floating Motion
    let ctx: gsap.Context | null = null;
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(
          [
            ".hero-telemetry",
            ".hero-handwriting",
            ".hero-title-line",
            ".hero-subtitle",
            ".hero-badge",
            ".hero-cta",
            ".hero-sticker-card",
            ".hero-seal-card",
            ".hero-manifest-card",
          ],
          { opacity: 1, y: 0, scale: 1, rotate: 0 }
        );
      } else {
        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          // PROVA 01 — HERO UNIFIED MASTER TIMELINE (Desktop >= 768px)
          mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // 0.0s: Barra de telemetria superior desliza suavemente
            tl.fromTo(
              ".hero-telemetry",
              { y: -20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              0.0
            );

            // 0.15s: Tag manuscrita surge com pop tátil
            tl.fromTo(
              ".hero-handwriting",
              { scale: 0.82, rotate: -4, opacity: 0 },
              { scale: 1, rotate: -2, opacity: 1, duration: 0.7, ease: "back.out(1.8)" },
              0.15
            );

            // 0.25s: THIAGO IBRAHIM entra com text mask reveal editorial
            tl.fromTo(
              ".hero-title-line",
              { y: "115%", opacity: 0 },
              {
                y: "0%",
                opacity: 1,
                duration: 1.0,
                stagger: 0.15,
                ease: "power4.out",
                clearProps: "willChange",
              },
              0.25
            );

            // 0.45s: Subtítulo descritivo entra
            tl.fromTo(
              ".hero-subtitle",
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
              0.45
            );

            // 0.55s: Os 4 badges de tecnologia entram com stagger escalonado de 0.08s
            tl.fromTo(
              ".hero-badge",
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.8)" },
              0.55
            );

            // 0.75s: Botões de CTA entram com slide suave
            tl.fromTo(
              ".hero-cta",
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
              0.75
            );

            // 0.30s: Foto sticker die-cut 3:4 entra com escala suave e inicia floating contínuo
            tl.fromTo(
              ".hero-sticker-card",
              { scale: 0.9, opacity: 0, rotate: -2 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 0.9,
                ease: "back.out(1.5)",
                onComplete: () => {
                  gsap.to(".hero-sticker-float", {
                    y: -10,
                    duration: 3.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                  });
                },
              },
              0.30
            );

            // 0.60s: Selo circular rotativo e card de manifesto entram coordenados
            tl.fromTo(
              ".hero-seal-card",
              { scale: 0.85, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.6)",
                onComplete: () => {
                  gsap.to(".hero-seal-float", {
                    y: -7,
                    duration: 2.6,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                  });
                },
              },
              0.60
            );

            tl.fromTo(
              ".hero-manifest-card",
              { y: 25, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power3.out" },
              0.60
            );
          });

          // Mobile (< 768px) - revelação rápida e fluida sem loops infinitos na main thread
          mm.add("(max-width: 767px)", () => {
            gsap.fromTo(
              [
                ".hero-telemetry",
                ".hero-handwriting",
                ".hero-title-line",
                ".hero-subtitle",
                ".hero-badge",
                ".hero-cta",
                ".hero-sticker-card",
                ".hero-manifest-card",
              ],
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }
            );
          });
        }, sectionRef);
      }
    }

    return () => {
      clearInterval(id);
      if (ctx) ctx.revert();
    };
  }, []);

  const person = siteData.person;

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative z-10 min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-6 md:py-8 overflow-hidden bg-transparent"
    >
      {/* Parallax Watermark de Fundo */}
      <ParallaxWatermark number="00" label="TI // ITAPEVI · 2026" position="right" speed={55} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10 w-full">
        {/* Top telemetry bar */}
        <div className="hero-telemetry flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 mb-5 md:mb-6 bg-[#141418] border border-zinc-800 rounded-lg font-mono text-xs text-zinc-400 shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-200 font-bold">{person.statusPill}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-zinc-500">HOST: ITAPEVI / SP</span>
            <span className="text-[#fbbf24] font-bold">{time} BRT</span>
          </div>
        </div>

        {/* Hero Core Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5 md:space-y-4">
            <div className="space-y-2">
              {/* Handwritten highlight note com entrada tátil */}
              <div className="hero-handwriting inline-block">
                <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl rotate-[-2deg] block select-none">
                  {person.handwrittenNote ?? "Building real systems from Itapevi 🚀"}
                </span>
              </div>

              {/* Giant Display Headline com Text Mask Reveal Editorial GSAP */}
              <h1
                id="hero-heading"
                className="font-display text-white text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[0.92] tracking-tighter select-none"
              >
                <span className="block overflow-hidden py-0.5">
                  <span className="inline-block hero-title-line">THIAGO</span>
                </span>
                <span className="block overflow-hidden py-0.5">
                  <span className="inline-block text-[#fbbf24] hero-title-line">IBRAHIM</span>
                </span>
              </h1>
            </div>

            {/* Subtitle & Value Proposition */}
            <p className="hero-subtitle text-base md:text-lg text-zinc-300 max-w-2xl font-sans leading-relaxed">
              {person.sub}
            </p>

            {/* Tech Sticker Badges - Stagger Escalonado Tátil */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="hero-badge badge-sticker bg-[#00d8ff] text-black border-black text-[11px] py-1 px-2.5">
                <Code2 className="w-3.5 h-3.5" />
                React 19 / TS 5.8
              </span>
              <span className="hero-badge badge-sticker bg-[#76b900] text-black border-black text-[11px] py-1 px-2.5">
                <Cpu className="w-3.5 h-3.5" />
                CUDA float16
              </span>
              <span className="hero-badge badge-sticker bg-[#22c55e] text-black border-black text-[11px] py-1 px-2.5">
                <Terminal className="w-3.5 h-3.5" />
                Baileys & Streams
              </span>
              <span className="hero-badge badge-sticker bg-[#fbbf24] text-black border-black text-[11px] py-1 px-2.5">
                Local-First Win32
              </span>
            </div>

            {/* CTAs com Entrada Sequencial Suave */}
            <div className="hero-cta flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projetos"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#fbbf24] text-black font-display text-sm md:text-base tracking-wider rounded-md border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                VER OS 4 PROJETOS NUCLEARES
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href={siteData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#141418] text-white font-mono text-xs uppercase tracking-wider rounded-md border border-zinc-700 hover:border-white transition-colors"
              >
                GITHUB REPOS ↗
              </a>
            </div>
          </div>

          {/* Right Column: 3:4 Die-Cut Sticker Slot, Overlaid Rotating Seal & Compact Manifest */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
            {/* Wrapper com Sticker Foto e Selo Sobreposto */}
            <div className="relative w-full max-w-[230px] sm:max-w-[250px] md:max-w-[265px] mx-auto">
              {/* 3:4 Aspect Ratio Sticker Slot com Entrada Tátil e Parallax Suave Desacoplado */}
              <motion.div style={{ y: stickerY }} className="hero-sticker-card will-change-transform">
                <div className="hero-sticker-float w-full aspect-[3/4] relative sticker-die-cut rounded-2xl bg-[#141418] border-2 border-white/90 shadow-[4px_10px_25px_rgba(0,0,0,0.8)] overflow-visible">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/images/thiago-hero-sticker.png"
                      alt="Thiago Ibrahim — Retrato recortado em sticker die-cut 3:4"
                      width={600}
                      height={800}
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="tape-strip -top-3.5 -right-3 w-28 bg-[#fbbf24]/70 text-black text-center flex items-center justify-center font-mono text-[9px] font-bold z-20 rotate-[5deg] shadow-md border border-black/30">
                    THIAGO // 1º TI
                  </div>
                </div>
              </motion.div>

              {/* Rotating Circular Seal posicionado organicamente como selo de autenticação sobre a foto */}
              <motion.div
                style={{ y: sealY }}
                className="hero-seal-card absolute -bottom-5 -left-6 md:-left-8 z-30 pointer-events-none will-change-transform"
              >
                <div className="hero-seal-float relative w-28 h-28 md:w-32 md:h-32 hidden sm:flex items-center justify-center">
                  <svg className="w-full h-full animate-spin-slow select-none" viewBox="0 0 100 100">
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[7.5px] font-mono tracking-[0.22em] fill-zinc-300 uppercase">
                      <textPath href="#circlePath">
                        THIAGO IBRAHIM • 1º TÉCNICO EM INFORMÁTICA • ETEC ITAPEVI •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 m-auto w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#141418] border-2 border-[#fbbf24] flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                    <span className="font-display text-base md:text-lg text-white">TT</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Manifest Card Compacto & Harmônico */}
            <motion.div
              style={{ y: manifestY }}
              className="hero-manifest-card w-full max-w-[240px] sm:max-w-[260px] md:max-w-[275px] mx-auto bg-[#141418] border border-zinc-800 pt-5 pb-3 px-3.5 sm:px-4 rounded-lg relative shadow-[3px_3px_0px_#000000] mt-3.5 sm:mt-4 text-center overflow-visible will-change-transform"
            >
              <div className="tape-strip -top-2.5 -right-2 w-20 bg-amber-500/50 text-amber-200 border border-amber-400/70 text-center flex items-center justify-center font-mono text-[8px] font-bold z-20 rotate-[5deg] shadow-md">
                MANIFESTO
              </div>
              <p className="font-mono text-[10px] text-[#fbbf24] uppercase tracking-wider mb-1">
                {"// MANIFESTO DO CONSTRUTOR"}
              </p>
              <p className="text-zinc-300 font-sans text-xs leading-relaxed italic mb-1.5">
                &ldquo;{person.anchor}&rdquo;
              </p>
              <p className="text-[10px] font-mono text-zinc-500">
                — Thiago Ibrahim (16 anos) · ETEC Itapevi
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
