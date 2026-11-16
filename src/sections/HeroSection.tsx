"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { siteData } from "@/data/site";
import { Terminal, ArrowUpRight, Cpu, Code2 } from "lucide-react";
import { gsap } from "@/lib/gsap";

export function HeroSection() {
  const [time, setTime] = useState("");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 1000);

    // GSAP Master Timeline para o Hero
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
            ".hero-cta > *",
            ".hero-sticker",
            ".hero-seal",
            ".hero-manifest",
          ],
          { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0%)", clearProps: "all" }
        );
      } else {
        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          // Desktop (>= 768px): Master Timeline Orquestrada com Precisão Cinematográfica
          mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // 0.0s: Barra de telemetria superior desliza de cima
            tl.fromTo(
              ".hero-telemetry",
              { y: -20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all" },
              0.0
            );

            // 0.15s: Tag manuscrita entra com pop tátil e leve rotação
            tl.fromTo(
              ".hero-handwriting",
              { scale: 0.82, rotate: -6, opacity: 0 },
              { scale: 1, rotate: -2, opacity: 1, duration: 0.7, ease: "back.out(2)", clearProps: "all" },
              0.15
            );

            // 0.25s: Título "THIAGO IBRAHIM" entra com mask reveal editorial (subindo da máscara)
            tl.fromTo(
              ".hero-title-line",
              { y: "115%", opacity: 0 },
              { y: "0%", opacity: 1, duration: 0.9, stagger: 0.12, ease: "power4.out", clearProps: "all" },
              0.25
            );

            // 0.45s: Subtítulo descritivo com fade + slide suave
            tl.fromTo(
              ".hero-subtitle",
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", clearProps: "all" },
              0.45
            );

            // 0.55s: Badges de tecnologia com stagger pop de 0.08s
            tl.fromTo(
              ".hero-badge",
              { scale: 0.75, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.8)", clearProps: "all" },
              0.55
            );

            // 0.72s: Botões de CTA com entrada progressiva escalonada
            tl.fromTo(
              ".hero-cta > *",
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "all" },
              0.72
            );

            // 0.25s: Foto sticker com clip-path reveal de baixo para cima
            tl.fromTo(
              ".hero-sticker",
              { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
              { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.95, ease: "power3.inOut", clearProps: "all" },
              0.25
            );

            // Floating motion sutil e orgânico no sticker após reveal
            tl.add(() => {
              gsap.to(".hero-sticker", {
                y: -6,
                duration: 3.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            });

            // 0.55s: Selo rotativo com pop suave
            tl.fromTo(
              ".hero-seal",
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)", clearProps: "all" },
              0.55
            );

            // 0.65s: Card do manifesto com entrada fluida
            tl.fromTo(
              ".hero-manifest",
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", clearProps: "all" },
              0.65
            );
          });

          // Mobile (< 768px): Revelação leve sem sobrecarregar thread
          mm.add("(max-width: 767px)", () => {
            gsap.fromTo(
              [
                ".hero-telemetry",
                ".hero-handwriting",
                ".hero-title-line",
                ".hero-subtitle",
                ".hero-badge",
                ".hero-cta > *",
                ".hero-sticker",
                ".hero-manifest",
              ],
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power2.out", clearProps: "all" }
            );
          });
        }, heroRef);
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
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative z-10 min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-10 md:py-12 overflow-hidden bg-transparent"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full">
        {/* Top telemetry bar */}
        <div className="hero-telemetry flex flex-wrap items-center justify-between gap-4 py-3 px-4 mb-6 md:mb-8 bg-[#141418] border border-zinc-800 rounded-lg font-mono text-xs text-zinc-400 shadow-[4px_4px_0px_#000000]">
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
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="lg:col-span-8 space-y-4 md:space-y-5 min-w-0">
            <div>
              {/* Handwritten highlight note */}
              <div className="hero-handwriting inline-block mb-1">
                <span className="font-handwriting text-[#fbbf24] text-2xl md:text-3xl rotate-[-2deg] block select-none">
                  {person.handwrittenNote ?? "Building real systems from Itapevi 🚀"}
                </span>
              </div>

              {/* Giant Display Headline com Mask Reveal editorial */}
              <h1
                id="hero-heading"
                className="font-display text-white text-[clamp(2.75rem,11vw,8.5rem)] leading-[0.88] tracking-tighter"
              >
                <span className="block overflow-hidden py-0.5">
                  <span className="block hero-title-line">THIAGO</span>
                </span>
                <span className="block overflow-hidden py-0.5">
                  <span className="block text-[#fbbf24] hero-title-line">IBRAHIM</span>
                </span>
              </h1>
            </div>

            {/* Subtitle & Value Proposition */}
            <p className="hero-subtitle text-lg md:text-xl text-zinc-300 max-w-2xl font-sans leading-relaxed">
              {person.sub}
            </p>

            {/* Tech Sticker Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="hero-badge badge-sticker bg-[#00d8ff] text-black border-black">
                <Code2 className="w-3.5 h-3.5" />
                React 19 / TS 5.8
              </span>
              <span className="hero-badge badge-sticker bg-[#76b900] text-black border-black">
                <Cpu className="w-3.5 h-3.5" />
                CUDA float16
              </span>
              <span className="hero-badge badge-sticker bg-[#22c55e] text-black border-black">
                <Terminal className="w-3.5 h-3.5" />
                Baileys & Streams
              </span>
              <span className="hero-badge badge-sticker bg-[#fbbf24] text-black border-black">
                Local-First Win32
              </span>
            </div>

            {/* CTAs */}
            <div className="hero-cta flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#projetos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#fbbf24] text-black font-display text-base tracking-wider rounded-md border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                VER OS 4 PROJETOS NUCLEARES
                <ArrowUpRight className="w-5 h-5" />
              </a>
              <a
                href={siteData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#141418] text-white font-mono text-xs uppercase tracking-wider rounded-md border border-zinc-700 hover:border-white transition-colors"
              >
                GITHUB REPOS ↗
              </a>
            </div>
          </div>

          {/* Right Column: 3:4 Die-Cut Sticker Slot & Rotating Seal */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-w-0 w-full">
            {/* 3:4 Aspect Ratio Sticker Slot com Clip-Path Reveal */}
            <div className="hero-sticker w-full max-w-[240px] sm:max-w-[270px] aspect-[3/4] relative mb-5 md:mb-6 sticker-die-cut rounded-2xl overflow-hidden bg-[#141418] border-2 border-white/90 shadow-[4px_10px_25px_rgba(0,0,0,0.8)] mx-auto">
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
            <div className="hero-seal relative w-28 h-28 md:w-32 md:h-32 mb-4 md:mb-5 hidden sm:flex items-center justify-center mx-auto">
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
              <div className="absolute inset-0 m-auto w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#141418] border-2 border-[#fbbf24] flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <span className="font-display text-base md:text-lg text-white">TT</span>
              </div>
            </div>

            {/* Manifest Card with Torn Edge */}
            <div className="hero-manifest w-full bg-[#141418] border border-zinc-800 p-5 rounded-lg relative shadow-[4px_4px_0px_#000000]">
              <div className="tape-strip top-[-12px] right-6 w-20" />
              <p className="font-mono text-xs text-[#fbbf24] uppercase tracking-wider mb-2">
                {"// MANIFESTO DO CONSTRUTOR"}
              </p>
              <p className="text-zinc-300 font-sans text-xs md:text-sm leading-relaxed italic mb-3">
                &ldquo;{person.anchor}&rdquo;
              </p>
              <p className="text-xs font-mono text-zinc-500">
                — Thiago Ibrahim (16 anos) · ETEC Itapevi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
