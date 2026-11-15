import { siteData } from "@/data/site";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-transparent border-t border-zinc-800 text-zinc-400 font-sans pb-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.85] tracking-tight text-white mb-2">
              THIAGO IBRAHIM
            </p>
            <p className="font-handwriting text-[#fbbf24] text-xl">
              {"// Systems Builder & Software Engineer · ETEC Itapevi"}
            </p>
          </div>
          <div className="font-mono text-xs text-zinc-500">
            BUILD 2026.11 · STREET-TECH & CREATIVE BRUTALISM
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-zinc-800/80 text-sm">
          <div>
            <p className="text-white font-mono text-xs uppercase mb-3 text-zinc-200">
              [OS 4 PROJETOS NUCLEARES]
            </p>
            <ul className="space-y-1.5 font-mono text-xs">
              <li><a href="#projetos" className="hover:text-[#fbbf24] transition-colors">▸ CodeAtlas (AST & React 19)</a></li>
              <li><a href="#projetos" className="hover:text-[#fbbf24] transition-colors">▸ WhatsApp Auto Sticker (Streams & Baileys)</a></li>
              <li><a href="#projetos" className="hover:text-[#fbbf24] transition-colors">▸ InterviewAI (Voice & FastAPI)</a></li>
              <li><a href="#projetos" className="hover:text-[#fbbf24] transition-colors">▸ Wasper (CUDA float16 & Win32)</a></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-mono text-xs uppercase mb-3 text-zinc-200">
              [GOVERNANÇA & STACK]
            </p>
            <p className="text-xs font-mono leading-relaxed text-zinc-400">
              Next.js 16 (App Router) + React 19 + TypeScript Estrito + Tailwind CSS v4 + Framer Motion. Zero dados fictícios.
            </p>
          </div>

          <div>
            <p className="text-white font-mono text-xs uppercase mb-3 text-zinc-200">
              [REPOSITÓRIO & AUDITORIA]
            </p>
            <a
              href={siteData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#fbbf24] hover:underline"
            >
              {siteData.contact.githubLabel}
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <p className="mt-3 text-[11px] font-mono text-zinc-500">
              Projetos auditados e mantidos por Thiago Ibrahim Vieira.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 Thiago Ibrahim. Todos os direitos de código reservados.</p>
          <p>ETEC de Itapevi · 1º Técnico em Informática</p>
        </div>
      </div>
    </footer>
  );
}
