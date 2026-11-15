"use client";

import { useState } from "react";
import { siteData } from "@/data/site";
import { Send, Terminal, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

export function ContactSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.email.trim() || !formData.mensagem.trim()) {
      setStatus("error");
      setErrorMessage("Por favor, preencha todos os campos antes do envio.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/thiagoibrahimvieira@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          mensagem: formData.mensagem,
          _subject: `⚡ Novo Dispatch do Portfólio // ${formData.nome}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const data = await response.json();

      if (response.ok && (data.success === "true" || data.success === true)) {
        setStatus("success");
        setFormData({ nome: "", email: "", mensagem: "" });
      } else {
        setStatus("error");
        setErrorMessage("Erro ao despachar mensagem. Tente novamente em instantes.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Falha de rede ao conectar com o serviço de despacho.");
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
                <p className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#fbbf24]" />
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-500/50 rounded text-red-200 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {status === "success" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded text-emerald-200 text-xs font-mono animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DISPATCH ENVIADO COM SUCESSO! A mensagem caiu na caixa postal de Thiago.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#fbbf24] text-black h-12 font-display text-sm tracking-wider uppercase rounded hover:bg-[#f59e0b] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 border border-black shadow-[2px_2px_0px_#000000]"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>DESPACHANDO TELEMETRIA...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DISPATCH CONCLUÍDO</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ENVIAR DISPATCH</span>
                  </>
                )}
              </button>
              <p className="text-xs font-mono text-zinc-500 text-center">
                Interação direta e transparente · Sem spam
              </p>
            </form>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
