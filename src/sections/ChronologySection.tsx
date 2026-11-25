"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { siteData } from "@/data/site";
import { ConstellationCanvas } from "@/components/effects/ConstellationCanvas";
import { RevealSection } from "@/components/effects/RevealSection";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import type { Project } from "@/types/site";

const TAPE_CONFIG: Record<string, { label: string; className: string }> = {
  caution: {
    label: "CUDA // LOCAL",
    className: "tape-caution w-32",
  },
  blueprint: {
    label: "AST // GRAPH",
    className: "w-28 bg-cyan-900/50 text-cyan-200 border-cyan-400/50",
  },
  spacesweep: {
    label: "NTFS // READ",
    className: "w-28 bg-cyan-900/50 text-cyan-200 border-cyan-400/50",
  },
  "nordicos-tattoo": {
    label: "UI // SYSTEM",
    className: "w-28 bg-amber-500/30 text-amber-200 border-amber-400/50",
  },
  "segundo-cerebro": {
    label: "AGENTS // CORE",
    className: "w-32 bg-purple-900/50 text-purple-200 border-purple-400/50",
  },
  opencrm: {
    label: "SAAS // RLS",
    className: "w-28 bg-emerald-900/50 text-emerald-200 border-emerald-400/50",
  },
  default: {
    label: "STREET // DEV",
    className: "w-24 bg-amber-500/30 text-amber-200 border-amber-400/50",
  },
};

function getProjectTape(project: Project) {
  if (project.tapeStyle === "caution") return TAPE_CONFIG.caution;
  if (project.tapeStyle === "blueprint") return TAPE_CONFIG.blueprint;
  return TAPE_CONFIG[project.id] || TAPE_CONFIG.default;
}

export function ChronologySection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const featuredProjects = siteData.projects.filter((p) => p.isFeaturedPillar);
  const otherProjects = siteData.projects.filter((p) => !p.isFeaturedPillar);

  return (
    <section id="projetos" aria-labelledby="projetos-heading" className="relative z-10 py-12 md:py-20 bg-transparent scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        {/* Section Header (8pt grid: 16px internal, 32px bottom separation) */}
        <RevealSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
            <div>
              <span className="font-handwriting text-[#fbbf24] text-xl md:text-2xl block mb-2">
                {"// Obras reais de engenharia auditadas"}
              </span>
              <h2 id="projetos-heading" className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-tight">
                PROJETOS NUCLEARES
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-white/65">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] animate-pulse shrink-0" />
              <span>0% DADOS FICTÍCIOS · ENGENHARIA AUDITADA</span>
            </div>
          </div>
        </RevealSection>

        {/* 1. Constellation Graph Card - Topologia Dinâmica */}
        <RevealSection delay={0.1} variant="scale-up">
          <figure className="bg-[#141418] border-2 border-zinc-700/80 rounded-2xl p-4 sm:p-6 mb-8 md:mb-12 shadow-[0_12px_32px_rgba(0,0,0,0.45),6px_6px_0px_#000000] relative overflow-hidden group">
            {/* Ambient Backlight Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <span className="font-mono text-xs md:text-sm text-white uppercase tracking-wider font-bold">
                  TOPOLOGIA DE DEPENDÊNCIAS & ARQUITETURA DE AST
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-xs text-[#fbbf24] bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/30">
                  {siteData.projects.length} MÓDULOS INTERCONECTADOS
                </span>
              </div>
            </div>

            <div className="w-full h-[290px] sm:h-[340px] md:h-[clamp(340px,48svh,520px)] relative min-w-0">
              <ConstellationCanvas
                onSelectProject={(id) => {
                  const found = siteData.projects.find((p) => p.id === id);
                  if (found) setSelectedProject(found);
                }}
              />
            </div>

            <figcaption className="text-xs font-mono text-white/65 mt-4 md:mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
              <span>— Toque ou clique em qualquer nó de projeto para abrir a arquitetura e repositório.</span>
              <span className="hidden sm:inline text-white/50 text-[11px]">[PHYSICS 60 FPS · 0% CPU ON IDLE]</span>
            </figcaption>
          </figure>
        </RevealSection>

        {/* 2. Featured Pillars: 1 col mobile (sem remoção de conteúdo), 2 cols sm, 3 cols lg (|1|2|3| / 4...) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 md:mb-16">
          {featuredProjects.map((p, idx) => (
            <RevealSection
              key={p.id}
              delay={0.08 * idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              className="min-w-0 flex"
            >
              <ProjectStreetCard project={p} onSelect={setSelectedProject} />
            </RevealSection>
          ))}
        </div>

        {/* Supporting Projects Archive com o MESMO visual Street-Tech */}
        {otherProjects.length > 0 && (
          <RevealSection delay={0.15}>
            <div className="mt-12 pt-12 border-t border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-zinc-800/80">
                <div>
                  <span className="font-handwriting text-[#fbbf24] text-xl block mb-2 select-none">
                    {"// obras complementares & experimentos auditados"}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                    PROJETOS DE SUPORTE & LABORATÓRIO
                  </h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-white/65">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{otherProjects.length} REPOSITÓRIOS AUDITADOS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((p, idx) => (
                  <RevealSection key={p.id} delay={0.08 * idx} variant="scale-up" className="flex min-w-0">
                    <ProjectStreetCard project={p} onSelect={setSelectedProject} />
                  </RevealSection>
                ))}
              </div>
            </div>
          </RevealSection>
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
}: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const tape = getProjectTape(project);
  const cardRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHover, setIsHover] = useState(false);

  const supportsFineHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || !supportsFineHover()) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 8,
      y: x * 8,
      glareX: ((e.clientX - rect.left) / rect.width) * 100,
      glareY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (supportsFineHover()) setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <article
      id={`project-${project.id}`}
      ref={cardRef}
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        isHover
          ? {
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
              transition: "transform 0.1s ease-out",
            }
          : undefined
      }
      className="bg-[#141418] border-2 border-zinc-700/80 rounded-2xl p-4 sm:p-6 relative flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.45),4px_4px_0px_#000000] hover:border-amber-400/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24] transition-colors group scroll-mt-24 cursor-pointer w-full h-full min-w-0"
    >
      {/* Specular Glare Effect on Hover (clipped safely inside card corners) */}
      {isHover && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Tape Effect Personalizado por Projeto */}
      <div className={`tape-strip top-[-10px] right-6 text-center flex items-center justify-center font-mono text-[10px] font-bold ${tape.className}`}>
        {tape.label}
      </div>

      {/* Grupo Superior: Visual + Identidade + Descrição (8pt Grid: 12px entre relacionados, 24px antes do próximo grupo) */}
      <div className="min-w-0">
        {project.image && (
          <div className="relative w-full aspect-[16/9] mb-4 rounded-xl overflow-hidden border border-zinc-700 shadow-[0_6px_16px_rgba(0,0,0,0.5)] bg-zinc-950">
            <Image
              src={project.image}
              alt={project.name}
              fill
              loading="eager"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Status & Badge (flex-wrap evita vazamento em qualquer largura) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-white/65 uppercase tracking-wider">
            {project.statusLabel}
          </span>
          {project.badgeSticker && (
            <span className="badge-sticker bg-[#fbbf24] text-black border-black text-[11px] py-0.5 shrink-0">
              {project.badgeSticker}
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3 className="font-display text-2xl md:text-3xl text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
          {project.name}
        </h3>

        {/* Handwritten Tagline */}
        {project.taglineHandwritten && (
          <p className="font-handwriting text-[#fbbf24] text-lg md:text-xl mb-3 select-none">
            {project.taglineHandwritten}
          </p>
        )}

        {/* Vision Statement (80% opacidade conforme hierarquia da skill) */}
        <p className="text-sm text-white/80 leading-relaxed mb-4 font-sans">
          {project.vision}
        </p>

        {/* Technical Bullets (65% opacidade, espaçamento 8px entre itens, 16px antes das stacks) */}
        <ul className="space-y-2 mb-6 text-xs text-white/65 font-sans">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#fbbf24] mt-0.5 select-none font-bold shrink-0">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Grupo Inferior: Stacks + Métricas + Thumb-Zone CTAs (44px+ altura) */}
      <div className="min-w-0">
        {/* Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.map((t, i) => (
            <span
              key={i}
              className="text-[11px] font-mono text-white/80 bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded-lg shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Real Metrics Grid (valor em destaque maior que o rótulo conforme anti-pattern da skill) */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 mb-4">
          {project.metrics.map((m, i) => (
            <div key={i} className="flex flex-col gap-1 min-w-0">
              <span className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                {m.value}
              </span>
              <span className="text-[10px] font-mono text-white/55 uppercase tracking-wider truncate">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Ações & Links (Todos os alvos >= 44px para conforto tátil) */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
            className="w-full min-h-[44px] py-3 px-4 bg-zinc-900 hover:bg-[#fbbf24] hover:text-black border border-zinc-700 hover:border-black rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000000] transition-colors duration-150 cursor-pointer"
          >
            <span>VER TELA DO PROJETO & REPO ↗</span>
          </button>

          {project.links && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 min-h-[44px] px-2 text-xs font-mono text-white/75 hover:text-[#fbbf24] transition-colors"
                >
                  <GithubIcon className="w-4 h-4 shrink-0" />
                  Repositório GitHub ↗
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 min-h-[44px] px-2 text-xs font-mono text-white/75 hover:text-[#fbbf24] transition-colors"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  Demonstração ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
