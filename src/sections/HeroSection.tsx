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

    // GSAP Hero Text Reveal & Floating Motion
    let ctx: gsap.Context | null = null;
    if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ctx = gsap.context(() => {
        // Text mask reveal editorial em THIAGO IBRAHIM (sem bloqueio de opacidade no container pai)
        gsap.fromTo(
          ".hero-title-line",
          { y: "115%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1.15,
            stagger: 0.18,
            ease: "power4.out",
            delay: 0.2,
            clearProps: "willChange",
          }
        );

        // Floating suave no die-cut sticker (isolado em container interno sem conflito com Framer Motion)
        gsap.to(".hero-sticker-float", {
          y: -10,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Floating suave no selo circular
        gsap.to(".hero-seal-float", {
          y: -7,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });
      }, sectionRef);
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
      className="relative z-10 pt-10 sm:pt-14 pb-8 sm:pb-12 md:py-28 overflow-hidden bg-transparent"
    >
      {/* Parallax Watermark de Fundo */}
      <ParallaxWatermark number="00" label="TI // ITAPEVI · 2026" position="right" speed={55} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        {/* Top telemetry bar */}
        <RevealSection variant="fade-up-soft" duration={0.85}>
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 mb-8 sm:mb-12 bg-[#141418] border border-zinc-800 rounded-lg font-mono text-xs text-zinc-400 shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-200 font-bold">{person.statusPill}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="hidden sm:inline-block text-zinc-500">HOST: ITAPEVI / SP</span>
              <span className="text-[#fbbf24] font-bold">{time} BRT</span>
            </div>
          </div>
        </RevealSection>

        {/* Hero Core Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {/* Handwritten highlight note com entrada tátil */}
              <RevealSection variant="stamp-pop" delay={0.1} duration={0.8}>
                <div className="inline-block">
                  <span className="font-handwriting text-[#fbbf24] text-2xl md:text-3xl rotate-[-2deg] block select-none">
                    {person.handwrittenNote ?? "Building real systems from Itapevi 🚀"}
                  </span>
                </div>
              </RevealSection>

              {/* Giant Display Headline com Text Mask Reveal Editorial GSAP (sem container com opacity: 0) */}
              <h1
                id="hero-heading"
                className="font-display text-white text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88] tracking-tighter select-none"
              >
                <span className="block overflow-hidden py-1">
                  <span className="inline-block hero-title-line">THIAGO</span>
                </span>
                <span className="block overflow-hidden py-1">
                  <span className="inline-block text-[#fbbf24] hero-title-line">IBRAHIM</span>
                </span>
              </h1>
            </div>

            {/* Subtitle & Value Proposition */}
            <RevealSection variant="fade-up-soft" delay={0.28} duration={0.9}>
              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl font-sans leading-relaxed">
                {person.sub}
              </p>
            </RevealSection>

            {/* Tech Sticker Badges - Stagger Escalonado Tátil */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <RevealSection variant="stamp-pop" delay={0.38} duration={0.75}>
                <span className="badge-sticker bg-[#00d8ff] text-black border-black">
                  <Code2 className="w-3.5 h-3.5" />
                  React 19 / TS 5.8
                </span>
              </RevealSection>
              <RevealSection variant="stamp-pop" delay={0.46} duration={0.75}>
                <span className="badge-sticker bg-[#76b900] text-black border-black">
                  <Cpu className="w-3.5 h-3.5" />
                  CUDA float16
                </span>
              </RevealSection>
              <RevealSection variant="stamp-pop" delay={0.54} duration={0.75}>
                <span className="badge-sticker bg-[#22c55e] text-black border-black">
                  <Terminal className="w-3.5 h-3.5" />
                  Baileys & Streams
                </span>
              </RevealSection>
              <RevealSection variant="stamp-pop" delay={0.62} duration={0.75}>
                <span className="badge-sticker bg-[#fbbf24] text-black border-black">
                  Local-First Win32
                </span>
              </RevealSection>
            </div>

            {/* CTAs com Entrada Sequencial Suave */}
            <RevealSection variant="fade-up-soft" delay={0.70} duration={0.85}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#projetos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#fbbf24] text-black font-display text-base tracking-wider rounded-md border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                  VER OS 4 PROJETOS NUCLEARES
                  <ArrowUpRight className="w-5 h-5" />
                </a>
                <a
                  href={siteData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#141418] text-white font-mono text-xs uppercase tracking-wider rounded-md border border-zinc-700 hover:border-white transition-colors"
                >
                  GITHUB REPOS ↗
                </a>
              </div>
            </RevealSection>
          </div>

          {/* Right Column: 3:4 Die-Cut Sticker Slot & Rotating Seal com Parallax de Profundidade */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative mt-8 lg:mt-0">
            {/* 3:4 Aspect Ratio Sticker Slot com Entrada Tátil e Parallax Suave Desacoplado */}
            <RevealSection variant="stamp-pop" delay={0.25} duration={0.95}>
              <motion.div style={{ y: stickerY }} className="will-change-transform">
                <div className="hero-sticker-float w-full max-w-[280px] sm:max-w-xs aspect-[3/4] relative mb-8 sm:mb-10 sticker-die-cut rounded-2xl bg-[#141418] border-2 border-white/90 shadow-[4px_10px_25px_rgba(0,0,0,0.8)] mx-auto overflow-visible">
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
            </RevealSection>

            {/* Rotating Circular Seal com Revelação Suave e Parallax */}
            <RevealSection variant="fade-up-soft" delay={0.42} duration={0.85}>
              <motion.div style={{ y: sealY }} className="will-change-transform">
                <div className="hero-seal-float relative w-36 h-36 mb-6 hidden sm:flex items-center justify-center mx-auto">
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
                  <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#141418] border-2 border-[#fbbf24] flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                    <span className="font-display text-xl text-white">TT</span>
                  </div>
                </div>
              </motion.div>
            </RevealSection>

            {/* Manifest Card with Torn Edge - Parallax Leve e Entrada Tátil */}
            <RevealSection variant="stamp-pop" delay={0.58} duration={0.9}>
              <motion.div
                style={{ y: manifestY }}
                className="w-full max-w-sm sm:max-w-md mx-auto bg-[#141418] border border-zinc-800 pt-8 pb-6 px-5 sm:p-7 sm:pt-8 rounded-lg relative shadow-[4px_4px_0px_#000000] mt-8 sm:mt-12 text-center overflow-visible will-change-transform"
              >
                <div className="tape-strip -top-3.5 -right-3 w-24 bg-amber-500/50 text-amber-200 border border-amber-400/70 text-center flex items-center justify-center font-mono text-[9px] font-bold z-20 rotate-[5deg] shadow-md">
                  MANIFESTO
                </div>
                <p className="font-mono text-xs text-[#fbbf24] uppercase tracking-wider mb-2">
                  {"// MANIFESTO DO CONSTRUTOR"}
                </p>
                <p className="text-zinc-300 font-sans text-sm leading-relaxed italic mb-3">
                  &ldquo;{person.anchor}&rdquo;
                </p>
                <p className="text-xs font-mono text-zinc-500">
                  — Thiago Ibrahim (16 anos) · ETEC Itapevi
                </p>
              </motion.div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}
