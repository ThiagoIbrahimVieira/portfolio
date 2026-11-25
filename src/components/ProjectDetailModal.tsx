"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Check, Copy, Terminal, Cpu, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import type { Project } from "@/types/site";

const emptySubscribe = () => () => {};

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const PROJECT_PIPELINES: Record<string, { flow: string[]; highlights: string }> = {
  opencrm: {
    flow: [
      "Vite SPA (React 19)",
      "Vercel Serverless (Fastify)",
      "AppSec LGPD (Blind Index HMAC)",
      "Supabase PostgreSQL 17",
      "Isolamento RLS Mandatório",
    ],
    highlights:
      "Plataforma SaaS multi-tenant metadata-driven em produção. Banco PostgreSQL 17 com isolamento RLS, conformidade LGPD e 57 testes automatizados aprovados.",
  },
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
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

  if (!mounted) return null;

  const copied = !!project && copiedId === project.id;
  const pipeline = project
    ? PROJECT_PIPELINES[project.id] || {
        flow: ["Input", "Processamento", "Validação", "Output"],
        highlights: project.vision,
      }
    : null;

  const cloneCommand = project
    ? `git clone ${project.links?.github || `https://github.com/ThiagoIbrahimVieira/${project.id}`}.git`
    : "";

  const handleCopyClone = async () => {
    if (!project || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(cloneCommand);
      setCopiedId(project.id);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard blocked by browser policy
    }
  };

  const modalContent = (
    <AnimatePresence>
      {project && pipeline && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-10"
        >
          {/* Backdrop com blur profundo cobrindo 100% da tela e do navbar */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal Card Outer Shell (keeps decorative tape unclipped above scroll container) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 320, damping: 28 },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 12,
              transition: { duration: 0.16, ease: "easeIn" },
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            className="relative w-full max-w-4xl max-h-[86vh] flex flex-col bg-[#141418] border-2 border-zinc-700/90 rounded-2xl shadow-[12px_12px_0px_#000000] z-10 text-white my-auto"
          >
          {/* Fita Adesiva Decorativa no Topo */}
          <div className="absolute -top-3.5 left-6 sm:left-10 w-28 sm:w-32 h-6 sm:h-7 bg-amber-400/40 border border-amber-400/70 -rotate-2 pointer-events-none shadow-sm flex items-center justify-center font-mono text-[9.5px] sm:text-[10px] text-amber-100 font-bold z-20">
            AUDIT // 2026.11
          </div>

          <div className="overflow-y-auto p-4 sm:p-7 md:p-10 scrollbar-thin scrollbar-thumb-zinc-700 rounded-2xl">
          {/* Barra Superior com Tags e Botão Fechar com Bom Respiro */}
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-7 pb-3.5 sm:pb-5 border-b border-zinc-800 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs text-zinc-300 font-bold uppercase tracking-wider">
                {project.statusLabel}
              </span>
              {project.badgeSticker && (
                <span className="badge-sticker bg-[#fbbf24] text-black border-black text-[10px] sm:text-[11px] py-0.5 ml-1">
                  {project.badgeSticker}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-[#fbbf24] hover:text-black hover:border-black font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#000000] cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
              <span>FECHAR [ESC]</span>
            </button>
          </div>

          {/* Bloco de Título & Subtítulo */}
          <div className="mb-5 sm:mb-7">
            <h3 id="modal-project-title" className="font-display text-2xl sm:text-4xl md:text-5xl text-white tracking-tight mb-1.5 sm:mb-2">
              {project.name}
            </h3>
            {project.taglineHandwritten && (
              <p className="font-handwriting text-[#fbbf24] text-lg sm:text-2xl md:text-3xl select-none">
                {project.taglineHandwritten}
              </p>
            )}
          </div>

          {/* Banner Visual com Proporção Otimizada */}
          {project.image && (
            <div className="relative w-full aspect-[16/9] max-h-[210px] sm:max-h-[340px] md:max-h-[420px] mb-6 sm:mb-8 rounded-xl overflow-hidden border-2 border-zinc-700 bg-zinc-950 shadow-[6px_6px_0px_#000000]">
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

          {/* Métricas Auditadas (valor em destaque > rótulo) */}
          <div className="mb-8">
            <h4 className="font-mono text-xs font-bold text-white/65 uppercase tracking-widest mb-4">
              MÉTRICAS AUDITADAS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-1"
                >
                  <span className="text-sm md:text-base font-mono font-bold text-white">
                    {m.value}
                  </span>
                  <span className="text-[11px] font-mono text-white/55 uppercase tracking-wider">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comandos do Git e Repositório */}
          <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs text-white/65 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                CLONAR REPOSITÓRIO LOCALMENTE
              </span>
              <button
                onClick={handleCopyClone}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg text-xs font-mono text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
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

          {/* Barra de Ações Finais (Links de Repositório e Demonstração - 44px alvos táteis) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={project.links?.github || `https://github.com/ThiagoIbrahimVieira/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] bg-[#fbbf24] hover:bg-amber-300 text-black font-mono font-bold text-xs md:text-sm px-6 py-3 rounded-xl border-2 border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),4px_4px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-black" />
                <span>ACESSAR REPOSITÓRIO GITHUB ↗</span>
              </a>

              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs md:text-sm px-5 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>VER DEMONSTRAÇÃO AO VIVO</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="min-h-[44px] px-3 text-xs font-mono text-white/65 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              Voltar ao Portfólio
            </button>
          </div>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
