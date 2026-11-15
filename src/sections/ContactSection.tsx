"use client";

import { useState } from "react";
import { siteData } from "@/data/site";
import { Send, Terminal, CheckCircle2, Mail, Copy, Check } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

export function ContactSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.email.trim() || !formData.mensagem.trim()) {
      return;
    }

    const subject = `⚡ [Portfólio] Contato de ${formData.nome}`;
    const body = `Nome / Organização: ${formData.nome}\nE-mail de Retorno: ${formData.email}\n\nMensagem:\n${formData.mensagem}`;

    const mailtoUrl = `mailto:thiagoibrahimvieira@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Dispara a abertura do e-mail nativo preenchido
    window.location.href = mailtoUrl;

    // Copia também para o clipboard como garantia
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`Para: thiagoibrahimvieira@gmail.com\nAssunto: ${subject}\n\n${body}`);
    }

    setDispatched(true);
  };

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("thiagoibrahimvieira@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="contato" aria-labelledby="contato-heading" className="relative z-10 py-24 md:py-32 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <RevealSection>
          <div className="bg-[#141418] border-2 border-zinc-700 rounded-xl grid md:grid-cols-2 gap-8 p-8 md:p-14 shadow-[6px_6px_0px_#ffffff] relative overflow-hidden">
            <div className="tape-strip top-[-10px] left-12 w-28 bg-[#fbbf24]/40" />

            <div className="flex flex-col justify-between">
              <div>
                <span className="font-handwriting text-[#fbbf24] text-2xl block mb-2">
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
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#fbbf24] shrink-0" />
                  <span className="text-white">thiagoibrahimvieira@gmail.com</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="ml-2 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded border border-zinc-600 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#fbbf24] shrink-0" />
                  <span>
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

            <form onSubmit={handleDispatch} className="flex flex-col gap-3">
              <label className="sr-only" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome / organização"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-4 h-12 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-sm transition-colors"
              />
              <label className="sr-only" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu-email@dominio.com"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-4 h-12 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-sm transition-colors"
              />
              <label className="sr-only" htmlFor="msg">
                Mensagem
              </label>
              <textarea
                id="msg"
                required
                rows={4}
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                placeholder="Descreva a demanda técnica ou ideia de colaboração..."
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-4 py-3 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-sm resize-none transition-colors"
              />

              {dispatched && (
                <div className="flex items-start gap-2.5 p-3.5 bg-emerald-950/70 border border-emerald-500/60 rounded text-emerald-200 text-xs font-mono animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">DISPATCH PREPARADO & ENVIADO AO SEU CLIENTE DE E-MAIL!</p>
                    <p className="text-zinc-300">
                      O e-mail foi aberto preenchido para <strong>thiagoibrahimvieira@gmail.com</strong> e o texto também foi copiado para sua área de transferência.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="bg-[#fbbf24] text-black h-12 font-display text-sm tracking-wider uppercase rounded hover:bg-[#f59e0b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-black shadow-[2px_2px_0px_#000000]"
              >
                <Send className="w-4 h-4" />
                <span>ENVIAR DISPATCH DIRETO</span>
              </button>
              <p className="text-xs font-mono text-zinc-500 text-center">
                Canal direto com Thiago · Sem intermediários ou risco de perda
              </p>
            </form>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
