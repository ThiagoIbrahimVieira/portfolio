"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Check, Copy, Terminal, Cpu, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import type { Project } from "@/types/site";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const PROJECT_PIPELINES: Record<string, { flow: string[]; highlights: string }> = {
  codeatlas: {
    flow: [
      "Código Fonte (Repo)",
      "Parser AST Desacoplado",
      "IR de Grafo (AtlasNode)",
      "Dynamic Imports (Adapters)",
      "Canvas 60 FPS (@xyflow)",
    ],
    highlights:
      "100% client-side sem tráfego de código para a nuvem. Bundle core dividido em apenas 4.93 kB com 190 testes automatizados via Vitest.",
  },
  "whatsapp-auto-sticker": {
    flow: [
      "Protocolo Baileys",
      "Streams de RAM (Buffer)",
      "Sharp + FFmpeg em Memória",
      "Injeção Exif / WebPMux",
      "0 Bytes em Disco",
    ],
    highlights:
      "Conversão multimídia assíncrona com zero I/O de disco rígido. 99.8% de taxa de conversão com validação estrita de contratos via Zod.",
  },
  interviewai: {
    flow: [
      "Web Speech API (Voz)",
      "FastAPI Async 0.115",
      "Inferência LLM (Puter.js)",
      "Scoring Multicritério",
      "Sessão Segura (JWT)",
    ],
    highlights:
      "Reconhecimento contínuo de voz com transcrição em tempo real, backend assíncrono em Python e persistência com SQLAlchemy.",
  },
  wasper: {
    flow: [
      "Hook Win32 (Driver Level)",
      "Captura Dual-Pass",
      "PyTorch CUDA float16",
      "Whisper large-v3-turbo",
      "Paste no Windows (<1ms)",
    ],
    highlights:
      "100% offline no Windows. Consumo de apenas ~1.8 GB VRAM com aceleração em GPU CUDA, eliminando 100% da dependência de nuvem.",
  },
  spacesweep: {
    flow: [
      "Varredura NTFS Nativa",
      "Bypass Junctions (dev:ino)",
      "Hash 4KB → SHA-256",
      "Treemap Virtualizado",
      "Modo Estrito Read-Only",
    ],
    highlights:
      "App desktop hardened em Electron 35. Nenhum arquivo é alterado ou deletado. 64 testes aprovados.",
  },
  "nordicos-tattoo": {
    flow: [
      "Design System Tokens",
      "Radix UI Primitives",
      "Framer Motion & Lenis",
      "Seções Modulares",
      "Lighthouse 100 Performance",
    ],
    highlights:
      "Showcase comercial de alto padrão com microinterações, SEO técnico completo e arquitetura modular desacoplada.",
  },
  "segundo-cerebro": {
    flow: [
      "Markdown Portátil",
      "Constituição AGENTS.md",
      "163 Skills Catalogadas",
      "ADRs & Logs Técnicos",
      "Squad Autônomo OpenBot",
    ],
    highlights:
      "Central de inteligência e memória local em Markdown portátil para governança de agentes autônomos e registro de engenharia.",
  },
};

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project || !mounted) return null;

  const pipeline = PROJECT_PIPELINES[project.id] || {
    flow: ["Input", "Processamento", "Validação", "Output"],
    highlights: project.vision,
  };

  const cloneCommand = `git clone ${project.links?.github || `https://github.com/ThiagoIbrahimVieira/${project.id}`}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto">
        {/* Backdrop com blur profundo cobrindo 100% da tela e do navbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Card com Respiro Expandido e Estética Street-Tech */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[#141418] border-2 border-zinc-700/90 rounded-2xl shadow-[16px_16px_0px_#000000] p-6 sm:p-8 md:p-12 z-10 text-white scrollbar-thin scrollbar-thumb-zinc-700 my-auto"
        >
          {/* Fita Adesiva Decorativa no Topo */}
          <div className="absolute -top-3.5 left-10 w-32 h-7 bg-amber-400/35 border border-amber-400/60 -rotate-2 pointer-events-none shadow-sm flex items-center justify-center font-mono text-[10px] text-amber-200 font-bold">
            AUDIT // 2026.11
          </div>

          {/* Barra Superior com Tags e Botão Fechar com Bom Respiro */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-zinc-800">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-zinc-300 font-bold uppercase tracking-wider">
                {project.statusLabel}
              </span>
              {project.badgeSticker && (
                <span className="badge-sticker bg-[#fbbf24] text-black border-black text-[11px] py-0.5 ml-2">
                  {project.badgeSticker}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-[#fbbf24] hover:text-black hover:border-black font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>FECHAR [ESC]</span>
            </button>
          </div>

          {/* Bloco de Título & Subtítulo */}
          <div className="mb-8">
            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-2.5">
              {project.name}
            </h3>
            {project.taglineHandwritten && (
              <p className="font-handwriting text-[#fbbf24] text-2xl md:text-3xl select-none">
                {project.taglineHandwritten}
              </p>
            )}
          </div>

          {/* Banner Visual com Proporção Otimizada */}
          {project.image && (
            <div className="relative w-full aspect-[16/9] max-h-[380px] md:max-h-[440px] mb-10 rounded-xl overflow-hidden border-2 border-zinc-700 bg-zinc-950 shadow-[6px_6px_0px_#000000]">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-sm border border-zinc-700 px-3 py-1 rounded font-mono text-[11px] text-zinc-300">
                [VISUALIZAÇÃO DE ARQUITETURA HOMOLOGADA]
              </div>
            </div>
          )}

          {/* Diagrama de Pipeline de Dados */}
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-6 mb-10">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-[#fbbf24] font-bold">
              <Cpu className="w-4 h-4" />
              <span>FLUXO DE DADOS & PIPELINE TÉCNICO</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs mb-4">
              {pipeline.flow.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 rounded-lg text-zinc-200">
                    {step}
                  </span>
                  {idx < pipeline.flow.length - 1 && (
                    <span className="text-[#fbbf24] font-bold">➔</span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed pt-3 border-t border-zinc-800/80">
              <span className="text-[#fbbf24] font-mono font-bold">▸ Destaque de Engenharia:</span> {pipeline.highlights}
            </p>
          </div>

          {/* Visão do Projeto */}
          <div className="mb-10">
            <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>VISÃO & ENGENHARIA</span>
            </h4>
            <p className="text-sm md:text-base text-zinc-200 font-sans leading-relaxed">
              {project.vision}
            </p>
          </div>

          {/* Destaques Técnicos (Bullets) */}
          <div className="mb-10">
            <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
              ESPECIFICAÇÕES DE CONSTRUÇÃO
            </h4>
            <ul className="space-y-3">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-zinc-300 font-sans">
                  <span className="text-[#fbbf24] font-bold text-sm mt-0.5 select-none">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arsenal de Tecnologias */}
          <div className="mb-10">
            <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3.5">
              STACK TECNOLÓGICA
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {project.stack.map((item, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs text-zinc-200 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Métricas Auditadas */}
          <div className="mb-10">
            <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
              MÉTRICAS AUDITADAS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    {m.label}
                  </span>
                  <span className="text-sm md:text-base font-mono font-bold text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comandos do Git e Repositório */}
          <div className="bg-black/60 border border-zinc-800 rounded-xl p-5 mb-10">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs text-zinc-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                CLONAR REPOSITÓRIO LOCALMENTE
              </span>
              <button
                onClick={handleCopyClone}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIADO!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPIAR</span>
                  </>
                )}
              </button>
            </div>
            <code className="font-mono text-xs md:text-sm text-amber-300 block select-all break-all py-1">
              {cloneCommand}
            </code>
          </div>

          {/* Barra de Ações Finais (Links de Repositório e Demonstração) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={project.links?.github || `https://github.com/ThiagoIbrahimVieira/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#fbbf24] hover:bg-amber-300 text-black font-mono font-bold text-xs md:text-sm px-6 py-3.5 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-black" />
                <span>ACESSAR REPOSITÓRIO GITHUB ↗</span>
              </a>

              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs md:text-sm px-5 py-3.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>VER DEMONSTRAÇÃO AO VIVO</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              Voltar ao Portfólio
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
