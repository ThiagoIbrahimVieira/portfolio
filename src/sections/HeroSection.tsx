"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteData } from "@/data/site";
import { Terminal, ArrowUpRight, Cpu, Code2 } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

export function HeroSection() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const person = siteData.person;

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative z-10 pt-10 sm:pt-14 pb-16 md:py-28 overflow-hidden bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Top telemetry bar */}
        <RevealSection>
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
            <RevealSection delay={0.1}>
              {/* Handwritten highlight note */}
              <div className="inline-block">
                <span className="font-handwriting text-[#fbbf24] text-2xl md:text-3xl rotate-[-2deg] block select-none">
                  {person.handwrittenNote ?? "Building real systems from Itapevi 🚀"}
                </span>
              </div>

              {/* Giant Display Headline */}
              <h1
                id="hero-heading"
                className="font-display text-white text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88] tracking-tighter"
              >
                THIAGO<br />
                <span className="text-[#fbbf24]">IBRAHIM</span>
              </h1>
            </RevealSection>

            {/* Subtitle & Value Proposition */}
            <RevealSection delay={0.2}>
              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl font-sans leading-relaxed">
                {person.sub}
              </p>
            </RevealSection>

            {/* Tech Sticker Badges */}
            <RevealSection delay={0.25}>
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <span className="badge-sticker bg-[#00d8ff] text-black border-black">
                  <Code2 className="w-3.5 h-3.5" />
                  React 19 / TS 5.8
                </span>
                <span className="badge-sticker bg-[#76b900] text-black border-black">
                  <Cpu className="w-3.5 h-3.5" />
                  CUDA float16
                </span>
                <span className="badge-sticker bg-[#22c55e] text-black border-black">
                  <Terminal className="w-3.5 h-3.5" />
                  Baileys & Streams
                </span>
                <span className="badge-sticker bg-[#fbbf24] text-black border-black">
                  Local-First Win32
                </span>
              </div>
            </RevealSection>

            {/* CTAs */}
            <RevealSection delay={0.3}>
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

          {/* Right Column: 3:4 Die-Cut Sticker Slot & Rotating Seal */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative mt-8 lg:mt-0">
            <RevealSection delay={0.2}>
              {/* 3:4 Aspect Ratio Sticker Slot */}
              <div className="w-full max-w-[280px] sm:max-w-xs aspect-[3/4] relative mb-10 sm:mb-8 sticker-die-cut rounded-2xl overflow-hidden bg-[#141418] border-2 border-white/90 shadow-[4px_10px_25px_rgba(0,0,0,0.8)] mx-auto">
                <Image
                  src="/images/thiago-hero-sticker.png"
                  alt="Thiago Ibrahim — Retrato recortado em sticker die-cut 3:4"
                  width={600}
                  height={800}
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="tape-strip top-[-8px] right-6 w-20" />
              </div>

              {/* Rotating Circular Seal */}
              <div className="relative w-36 h-36 mb-6 hidden sm:flex items-center justify-center mx-auto">
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

              {/* Manifest Card with Torn Edge */}
              <div className="w-full bg-[#141418] border border-zinc-800 p-5 sm:p-6 rounded-lg relative shadow-[4px_4px_0px_#000000] mt-4 sm:mt-0">
                <div className="tape-strip top-[-12px] right-6 w-20" />
                <p className="font-mono text-xs text-[#fbbf24] uppercase tracking-wider mb-2">
                  {"// MANIFESTO DO CONSTRUTOR"}
                </p>
                <p className="text-zinc-300 font-sans text-sm leading-relaxed italic mb-4">
                  &ldquo;{person.anchor}&rdquo;
                </p>
                <p className="text-xs font-mono text-zinc-500">
                  — Thiago Ibrahim (16 anos) · ETEC Itapevi
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}
