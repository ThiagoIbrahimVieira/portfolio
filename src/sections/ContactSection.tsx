"use client";

import { useState } from "react";
import { siteData } from "@/data/site";
import { Send, Terminal } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contato" aria-labelledby="contato-heading" className="relative z-10 py-14 md:py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <RevealSection>
          <div className="bg-[#141418] border-2 border-zinc-700 rounded-xl grid md:grid-cols-2 gap-8 p-6 md:p-10 shadow-[6px_6px_0px_#ffffff] relative overflow-hidden min-w-0">
            <div className="tape-strip top-[-10px] left-12 w-28 bg-[#fbbf24]/40" />

            <div className="flex flex-col justify-between min-w-0">
              <div>
                <span className="font-handwriting text-[#fbbf24] text-2xl block mb-2 select-none">
                  {"// canal direto de engenharia"}
                </span>
                <h2 id="contato-heading" className="font-display text-4xl md:text-5xl text-white leading-tight mb-4">
                  VAMOS CONVERSAR
                </h2>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-md mb-6">
                  Todos os projetos possuem código aberto no GitHub com documentação e testes. Aberto a discussões de engenharia, sistemas locais e parcerias técnicas.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs text-zinc-400">
                <p className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#fbbf24] shrink-0" />
                  <span className="truncate">
                    GITHUB:{" "}
                    <a
                      href={siteData.contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#fbbf24] underline"
                    >
                      {siteData.contact.githubLabel}
                    </a>
                  </span>
                </p>
                <p className="text-zinc-500">Itapevi, São Paulo · Brasil</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-0">
              <label className="sr-only" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome / organização"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-4 h-12 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-sm"
              />
              <label className="sr-only" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu-email@dominio.com"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-4 h-12 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-sm"
              />
              <label className="sr-only" htmlFor="msg">
                Mensagem
              </label>
              <textarea
                id="msg"
                placeholder="Descreva a demanda técnica ou ideia de colaboração..."
                rows={4}
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-4 py-3 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-sm resize-none"
              />
              <button
                type="button"
                onClick={() => setSent(true)}
                className="bg-[#fbbf24] text-black h-12 font-display text-sm tracking-wider uppercase rounded hover:bg-[#f59e0b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-black shadow-[2px_2px_0px_#000000]"
              >
                <Send className="w-4 h-4" />
                {sent ? "MENSAGEM ENVIADA (SIMULADO)" : "ENVIAR DISPATCH"}
              </button>
              <p className="text-xs font-mono text-zinc-500 text-center">
                Interação direta e transparente · Sem spam
              </p>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
