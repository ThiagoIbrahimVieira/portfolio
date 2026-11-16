"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteData } from "@/data/site";
import { ConstellationCanvas } from "@/components/effects/ConstellationCanvas";
import { RevealSection } from "@/components/effects/RevealSection";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { ParallaxWatermark } from "@/components/effects/ParallaxWatermark";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Project } from "@/types/site";

export function ChronologySection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const featuredProjects = siteData.projects.filter((p) => p.isFeaturedPillar);
  const otherProjects = siteData.projects.filter((p) => !p.isFeaturedPillar);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop Animations (>= 768px)
      mm.add("(min-width: 768px)", () => {
        // 1. Constellation Map Entrance
        gsap.fromTo(
          ".constellation-card-figure",
          { opacity: 0, scale: 0.95, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".constellation-card-figure",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // 2. The 4 Nuclear Project Cards — Diversified Motion
        const nuclearConfigs = [
          { id: "#project-desktop-codeatlas", from: { x: -65, opacity: 0, rotate: -1.5 } },
          { id: "#project-desktop-whatsapp-auto-sticker", from: { x: 65, opacity: 0, rotate: 1.5 } },
          { id: "#project-desktop-wasper", from: { y: 55, scale: 0.92, opacity: 0 } },
          { id: "#project-desktop-spacesweep", from: { x: 65, y: 25, opacity: 0 } },
        ];

        nuclearConfigs.forEach(({ id, from }) => {
          const cardEl = document.querySelector(id);
          if (!cardEl) return;

          // Card container entrance
          gsap.fromTo(cardEl, from, {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            onComplete: () => {
              gsap.set(cardEl, { clearProps: "transform" });
            },
            scrollTrigger: {
              trigger: cardEl,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          });

          // Banner Image Clip-path Reveal
          const banner = cardEl.querySelector(".project-banner-wrapper");
          if (banner) {
            gsap.fromTo(
              banner,
              { clipPath: "inset(100% 0% 0% 0%)", scale: 1.05 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 0.9,
                ease: "power3.inOut",
                scrollTrigger: {
                  trigger: cardEl,
                  start: "top 78%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          // Tech pills micro-stagger
          const pills = cardEl.querySelectorAll(".project-stack-pill");
          if (pills.length > 0) {
            gsap.fromTo(
              pills,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                stagger: 0.05,
                delay: 0.25,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: cardEl,
                  start: "top 78%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });

        // 3. Supporting Projects Grid
        const supportCards = document.querySelectorAll(".project-support-card");
        if (supportCards.length > 0) {
          gsap.fromTo(
            supportCards,
            { opacity: 0, y: 40, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.14,
              ease: "power3.out",
              scrollTrigger: {
                trigger: supportCards[0],
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      id="projetos"
      ref={sectionRef}
      aria-labelledby="projetos-heading"
      className="relative z-10 py-10 sm:py-14 md:py-32 bg-transparent overflow-hidden"
    >
      {/* Parallax Watermark de Fundo */}
      <ParallaxWatermark number="01" label="CORE // PROJETOS NUCLEARES" position="right" speed={55} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <RevealSection variant="blur-fade" duration={0.95}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 md:mb-16 pb-6 border-b border-zinc-800">
            <div>
              <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl block mb-1">
                {"// 4 obras reais de engenharia"}
              </span>
              <h2 id="projetos-heading" className="font-display text-4xl md:text-6xl text-white tracking-tight">
                PROJETOS NUCLEARES
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] animate-pulse" />
              <span>0% DADOS FICTÍCIOS · ENGENHARIA AUDITADA</span>
            </div>
          </div>
        </RevealSection>

        {/* 1. Constellation Graph Card - Topologia Dinâmica */}
        <figure className="constellation-card-figure bg-[#141418] border-2 border-zinc-700/80 rounded-xl p-4 sm:p-6 md:p-8 mb-8 md:mb-16 shadow-[6px_6px_0px_#000000] relative overflow-hidden group">
          {/* Ambient Backlight Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-mono text-xs md:text-sm text-zinc-200 uppercase tracking-widest font-bold">
                TOPOLOGIA DE DEPENDÊNCIAS & ARQUITETURA DE AST
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs text-[#fbbf24] bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/30">
                {siteData.projects.length} MÓDULOS INTERCONECTADOS
              </span>
            </div>
          </div>

          <div className="w-full h-[280px] sm:h-[380px] md:h-[540px] relative">
            <ConstellationCanvas
              onSelectProject={(id) => {
                const found = siteData.projects.find((p) => p.id === id);
                if (found) setSelectedProject(found);
              }}
            />
          </div>

          <figcaption className="text-xs font-mono text-zinc-400 mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
            <span>— Grafo orbital em tempo real: clique em qualquer nó de projeto para abrir sua tela técnica e repositório.</span>
            <span className="text-zinc-500 text-[11px]">[PHYSICS 60 FPS · 0% CPU ON IDLE]</span>
          </figcaption>
        </figure>

        {/* 2. Mobile Snap-to-Card Carousel (< 768px) com rolagem fluida e snap */}
        <div className="block md:hidden mb-8 sm:mb-12 md:mb-16">
          <p className="text-xs font-mono text-zinc-400 mb-3 flex items-center gap-1.5">
            <span className="text-[#fbbf24]">◀ ▶</span> Deslize para navegar pelos 4 cards nucleares
          </p>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
            {featuredProjects.map((p) => (
              <div key={p.id} className="shrink-0 w-[84vw] max-w-[340px] snap-center">
                <ProjectStreetCard project={p} onSelect={setSelectedProject} idPrefix="project-mobile" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout com 3D Tilt e Entrada Animada Dedicada GSAP */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 mb-20">
          {featuredProjects.map((p) => (
            <ProjectStreetCard
              key={p.id}
              project={p}
              onSelect={setSelectedProject}
              idPrefix="project-desktop"
            />
          ))}
        </div>

        {/* Supporting Projects Archive com o MESMO visual Street-Tech (Imagem 4) */}
        {otherProjects.length > 0 && (
          <div className="mt-20 pt-16 border-t border-zinc-800">
            <RevealSection variant="blur-fade" duration={0.6}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-800/80">
                <div>
                  <span className="font-handwriting text-[#fbbf24] text-xl block mb-1 select-none">
                    {"// obras complementares & experimentos auditados"}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight">
                    PROJETOS DE SUPORTE & LABORATÓRIO
                  </h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{otherProjects.length} REPOSITÓRIOS AUDITADOS</span>
                </div>
              </div>
            </RevealSection>

            {/* Grid idêntico aos cards nucleares com 3D tilt, fita adesiva e stagger alternado */}
            <div className="grid md:grid-cols-3 gap-8">
              {otherProjects.map((p) => (
                <div key={p.id} className="project-support-card">
                  <ProjectStreetCard
                    project={p}
                    onSelect={setSelectedProject}
                    idPrefix="project-support"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Detalhes Técnicos & Repositório */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}

function ProjectStreetCard({
  project,
  onSelect,
  idPrefix = "project-desktop",
}: {
  project: Project;
  onSelect: (p: Project) => void;
  idPrefix?: string;
}) {
  const isCaution = project.tapeStyle === "caution";
  const isBlueprint = project.tapeStyle === "blueprint";

  const cardRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHover, setIsHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 8, // Inclinação suave no eixo X
      y: x * 8,  // Inclinação suave no eixo Y
      glareX: ((e.clientX - rect.left) / rect.width) * 100,
      glareY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => {
    setIsHover(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <article
      id={`${idPrefix}-${project.id}`}
      data-project-id={project.id}
      ref={cardRef}
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHover
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
          : "none",
        transition: isHover ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
      }}
      className="bg-[#141418] border-2 border-zinc-700/80 rounded-xl p-4 sm:p-6 md:p-8 relative flex flex-col justify-between shadow-[6px_6px_0px_#000000] hover:border-amber-400/80 transition-colors group overflow-visible scroll-mt-28 cursor-pointer"
    >
      {/* Specular Glare Effect on Hover */}
      {isHover && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-xl transition-opacity duration-200 overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Tape Effect Personalizado por Projeto - Inclinado na pontinha direita */}
      {isCaution ? (
        <div className="tape-strip tape-caution -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 w-32 text-center flex items-center justify-center font-mono text-[10px] font-bold z-20 rotate-[5deg] shadow-md">
          CUDA // LOCAL
        </div>
      ) : isBlueprint ? (
        <div className="tape-strip -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 w-28 bg-cyan-900/60 text-cyan-200 border-cyan-400/60 text-center flex items-center justify-center font-mono text-[10px] font-bold z-20 rotate-[5deg] shadow-md">
          AST // GRAPH
        </div>
      ) : project.id === "spacesweep" ? (
        <div className="tape-strip -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 w-28 bg-cyan-900/60 text-cyan-200 border-cyan-400/60 text-center flex items-center justify-center font-mono text-[10px] font-bold z-20 rotate-[5deg] shadow-md">
          NTFS // READ
        </div>
      ) : project.id === "nordicos-tattoo" ? (
        <div className="tape-strip -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 w-28 bg-amber-500/40 text-amber-200 border-amber-400/60 text-center flex items-center justify-center font-mono text-[10px] font-bold z-20 rotate-[5deg] shadow-md">
          UI // SYSTEM
        </div>
      ) : project.id === "segundo-cerebro" ? (
        <div className="tape-strip -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 w-32 bg-purple-900/60 text-purple-200 border-purple-400/60 text-center flex items-center justify-center font-mono text-[10px] font-bold z-20 rotate-[5deg] shadow-md">
          AGENTS // CORE
        </div>
      ) : (
        <div className="tape-strip -top-3.5 -right-2.5 sm:-top-4 sm:-right-3 w-24 bg-amber-500/40 text-amber-200 border-amber-400/60 text-center flex items-center justify-center font-mono text-[10px] font-bold z-20 rotate-[5deg] shadow-md">
          STREET // DEV
        </div>
      )}

      <div>
        {/* Project Visual Banner with Clip-Path Reveal Class */}
        {project.image && (
          <div className="project-banner-wrapper relative w-full aspect-[16/9] max-h-36 sm:max-h-48 md:max-h-none mb-3 md:mb-6 rounded-lg overflow-hidden border border-zinc-700 shadow-[4px_4px_0px_#000000] bg-zinc-950">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}
        {/* Status & Badge */}
        {project.image ? (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 md:mb-3">
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {project.statusLabel}
            </span>
            {project.badgeSticker && (
              <span className="badge-sticker bg-[#fbbf24] text-black border-black text-[11px] py-0.5">
                {project.badgeSticker}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1.5 mb-3 pt-6 pr-28">
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {project.statusLabel}
            </span>
            {project.badgeSticker && (
              <span className="badge-sticker bg-[#fbbf24] text-black border-black text-[11px] py-0.5 self-start">
                {project.badgeSticker}
              </span>
            )}
          </div>
        )}

        {/* Project Title */}
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-white tracking-tight mb-1.5 md:mb-2 group-hover:text-amber-300 transition-colors">
          {project.name}
        </h3>

        {/* Handwritten Tagline */}
        {project.taglineHandwritten && (
          <p className="font-handwriting text-[#fbbf24] text-sm sm:text-base md:text-lg mb-2 md:mb-4 select-none">
            {project.taglineHandwritten}
          </p>
        )}

        {/* Vision Statement */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3 md:mb-6 font-sans line-clamp-2 md:line-clamp-none">
          {project.vision}
        </p>

        {/* Technical Bullets - Compactado no mobile */}
        <ul className="space-y-1.5 md:space-y-2 mb-3 md:mb-6 text-xs text-zinc-400 font-sans">
          {project.bullets.slice(0, 2).map((b, i) => (
            <li key={i} className="flex items-start gap-1.5 md:gap-2">
              <span className="text-[#fbbf24] mt-0.5 select-none font-bold">▸</span>
              <span className="line-clamp-1 md:line-clamp-none">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {/* Stack Pills with Stagger Class */}
        <div className="flex flex-wrap gap-1.5 mb-3 md:mb-6">
          {project.stack.map((t, i) => (
            <span
              key={i}
              className="project-stack-pill text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-700/80 px-2 py-0.5 rounded shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 pt-3 md:pt-4 border-t border-zinc-800 bg-zinc-950/60 -mx-4 -mb-4 md:-mx-8 md:-mb-8 p-3 md:p-6 rounded-b-xl">
          {project.metrics.map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                {m.label}
              </span>
              <span className="font-mono text-xs md:text-sm text-white font-bold tracking-tight">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Card CTA & Detail trigger button */}
        <div className="mt-4 pt-3 flex items-center justify-between">
          <button
            type="button"
            className="text-xs font-mono text-[#fbbf24] hover:text-amber-300 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform"
          >
            [INSPECIONAR PROJETO] →
          </button>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-zinc-500 hover:text-white p-1 rounded transition-colors"
              aria-label={`Abrir repositório de ${project.name}`}
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
