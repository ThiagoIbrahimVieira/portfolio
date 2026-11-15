"use client";

import { useState } from "react";
import { siteData } from "@/data/site";
import { Send, Terminal, CheckCircle2, Mail, Copy, Check, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

export function ContactSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success-mail" | "success-wa" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    if (!formData.nome.trim()) {
      setStatus("error");
      setErrorMessage("Por favor, preencha o seu nome ou organização.");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setStatus("error");
      setErrorMessage("Por favor, informe um e-mail válido para que Thiago possa te responder.");
      return false;
    }
    if (!formData.mensagem.trim()) {
      setStatus("error");
      setErrorMessage("Por favor, descreva a demanda técnica ou mensagem.");
      return false;
    }
    setStatus("idle");
    setErrorMessage("");
    return true;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.mensagem.trim()) {
      setStatus("error");
      setErrorMessage("Preencha ao menos seu nome e a mensagem para enviar no WhatsApp.");
      return;
    }

    const text = `Olá Thiago! Sou ${formData.nome}${formData.email ? ` (${formData.email})` : ""}.\n\nDemanda/Ideia:\n${formData.mensagem}`;
    const waUrl = `https://wa.me/5511919498217?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");
    setStatus("success-wa");
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        setStatus("success-mail");
        setFormData({ nome: "", email: "", mensagem: "" });
      } else if (data?.needsConfig) {
        // Fallback elegante caso a chave da API ainda não tenha sido colocada na Vercel
        const subject = `⚡ [Portfólio] Contato de ${formData.nome}`;
        const body = `Nome: ${formData.nome}\nE-mail: ${formData.email}\n\nMensagem:\n${formData.mensagem}`;
        window.location.href = `mailto:thiagoibrahimvieira@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`Para: thiagoibrahimvieira@gmail.com\nAssunto: ${subject}\n\n${body}`);
        }
        setStatus("success-mail");
      } else {
        setStatus("error");
        setErrorMessage(data?.error || "Erro ao processar envio. Tente pelo WhatsApp.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Falha de conexão com a API de e-mail. Utilize o botão do WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("thiagoibrahimvieira@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="contato" aria-labelledby="contato-heading" className="relative z-10 pt-12 pb-28 md:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <RevealSection>
          <div className="bg-[#141418] border-2 border-zinc-700 rounded-xl grid md:grid-cols-2 gap-6 md:gap-10 p-5 sm:p-7 md:p-12 shadow-[5px_5px_0px_#ffffff] relative overflow-hidden">
            <div className="tape-strip top-[-10px] left-8 sm:left-12 w-28 bg-[#fbbf24]/40" />

            {/* Coluna da Esquerda: Info & Telemetria */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <span className="font-handwriting text-[#fbbf24] text-xl sm:text-2xl block mb-1">
                  {"// canal direto de engenharia"}
                </span>
                <h2 id="contato-heading" className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-2 sm:mb-3">
                  VAMOS CONVERSAR
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-md">
                  Projetos com código aberto no GitHub, documentação e testes. Aberto a discussões de engenharia, sistemas locais e parcerias técnicas.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs text-zinc-400">
                {/* Email Box com botão de cópia responsivo */}
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-mono truncate">
                      thiagoibrahimvieira@gmail.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="self-start sm:self-auto px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-600 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
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

            {/* Coluna da Direita: Formulário Compacto & Ações Diretas */}
            <form onSubmit={handleDispatch} className="flex flex-col gap-2.5">
              <label className="sr-only" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome / organização *"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-3.5 h-10 sm:h-11 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-xs sm:text-sm transition-colors"
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
                placeholder="seu-email@dominio.com *"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-3.5 h-10 sm:h-11 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-xs sm:text-sm transition-colors"
              />
              <label className="sr-only" htmlFor="msg">
                Mensagem
              </label>
              <textarea
                id="msg"
                required
                rows={3}
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                placeholder="Descreva a demanda técnica ou ideia de colaboração... *"
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 px-3.5 py-2.5 rounded focus:outline-none focus:border-[#fbbf24] font-sans text-xs sm:text-sm resize-none transition-colors"
              />

              {status === "error" && (
                <div className="flex items-center gap-2 p-2.5 bg-red-950/70 border border-red-500/60 rounded text-red-200 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {status === "success-wa" && (
                <div className="flex items-start gap-2 p-3 bg-emerald-950/70 border border-emerald-500/60 rounded text-emerald-200 text-xs font-mono animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">WHATSAPP ABERTO!</p>
                    <p className="text-zinc-300">A conversa foi iniciada com sua mensagem pronta para envio.</p>
                  </div>
                </div>
              )}

              {status === "success-mail" && (
                <div className="flex items-start gap-2 p-3 bg-emerald-950/70 border border-emerald-500/60 rounded text-emerald-200 text-xs font-mono animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">DISPATCH ENVIADO COM SUCESSO!</p>
                    <p className="text-zinc-300">Thiago recebeu seu e-mail diretamente e responderá em breve.</p>
                  </div>
                </div>
              )}

              {/* Botões de Ação Direta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black h-11 font-display text-xs sm:text-sm tracking-wider uppercase rounded active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 border border-black shadow-[2px_2px_0px_#000000]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ENVIAR NO WHATSAPP</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-60 text-black h-11 font-display text-xs sm:text-sm tracking-wider uppercase rounded active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 border border-black shadow-[2px_2px_0px_#000000]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ENVIANDO...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ENVIAR PELO EMAIL</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] font-mono text-zinc-500 text-center mt-1">
                Canal direto com Thiago · Sem intermediários públicos
              </p>
            </form>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
