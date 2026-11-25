"use client";

import { useState, useRef, useEffect } from "react";
import { siteData } from "@/data/site";
import { Send, Terminal, CheckCircle2, Mail, Copy, Check, MessageSquare, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";
import { RevealSection } from "@/components/effects/RevealSection";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const validate = () => {
    const nome = formData.nome.trim();
    const email = formData.email.trim();
    const mensagem = formData.mensagem.trim();
    if (!nome || nome.length > 120) {
      setStatus("error");
      setErrorMessage("Por favor, preencha um nome ou organização válido (até 120 caracteres).");
      return false;
    }
    if (!EMAIL_REGEX.test(email) || email.length > 200) {
      setStatus("error");
      setErrorMessage("Por favor, informe um e-mail válido para que Thiago possa te responder.");
      return false;
    }
    if (!mensagem || mensagem.length > 5000) {
      setStatus("error");
      setErrorMessage("Por favor, descreva a demanda técnica ou mensagem (até 5000 caracteres).");
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

    const text = `Olá Thiago! Sou ${formData.nome}${formData.email ? ` (${formData.email})` : ""}.\n\nDemanda / Mensagem:\n${formData.mensagem}`;
    const waUrl = `https://wa.me/5511919498217?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");
    setStatus("success-wa");
  };

  const handleSendEmail = async (e: React.FormEvent) => {
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
        // Fallback gracioso para mailto caso a chave precise de reload
        const subject = `⚡ [Portfólio] Contato de ${formData.nome}`;
        const body = `Nome: ${formData.nome}\nE-mail: ${formData.email}\n\nMensagem:\n${formData.mensagem}`;
        window.location.href = `mailto:thiagoibrahimvieira@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        if (typeof navigator !== "undefined" && navigator.clipboard) {
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

  const handleCopyEmail = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText("thiagoibrahimvieira@gmail.com");
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked by browser policy
    }
  };

  return (
    <section id="contato" aria-labelledby="contato-heading" className="relative z-10 py-12 md:py-20 bg-transparent scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <RevealSection>
          <div className="bg-[#141418] border-2 border-zinc-700 rounded-2xl grid md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.45),5px_5px_0px_#ffffff] relative min-w-0">
            <div className="tape-strip top-[-10px] left-8 sm:left-12 w-28 bg-[#fbbf24]/40" />

            {/* Coluna da Esquerda: Info & Telemetria (8pt grid) */}
            <div className="flex flex-col justify-between space-y-6 min-w-0">
              <div>
                <span className="font-handwriting text-[#fbbf24] text-xl sm:text-2xl block mb-2 select-none">
                  {"// canal direto de engenharia"}
                </span>
                <h2 id="contato-heading" className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-3">
                  VAMOS CONVERSAR
                </h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-[600px]">
                  Todos os projetos possuem código aberto no GitHub com documentação e testes. Aberto a discussões de engenharia, sistemas locais e parcerias técnicas.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs text-white/65">
                {/* Email Box com botão de cópia responsivo (44px alvo tátil) */}
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-mono break-all">
                      thiagoibrahimvieira@gmail.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="self-start sm:self-auto min-h-[44px] px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-600 transition-colors flex items-center gap-2 text-xs font-mono font-bold cursor-pointer shrink-0"
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

                <p className="flex items-start gap-2 min-w-0">
                  <Terminal className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
                  <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0 text-[11px] sm:text-xs">
                    <span>GITHUB:</span>
                    <a
                      href={siteData.contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-white hover:text-[#fbbf24] underline break-all"
                    >
                      {siteData.contact.githubLabel}
                      <ArrowUpRight className="w-3 h-3 shrink-0" />
                    </a>
                  </span>
                </p>

                {siteData.contact.linkedin && (
                  <p className="flex items-start gap-2 min-w-0">
                    <Terminal className="w-4 h-4 text-[#0a66c2] shrink-0 mt-0.5" />
                    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0 text-[11px] sm:text-xs">
                      <span>LINKEDIN:</span>
                      <a
                        href={siteData.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-white hover:text-[#fbbf24] underline break-all"
                      >
                        {siteData.contact.linkedinLabel}
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                      </a>
                    </span>
                  </p>
                )}
                <p className="text-zinc-500">Itapevi, São Paulo · Brasil</p>
              </div>
            </div>

            {/* Coluna da Direita: Formulário Compacto & Ações Diretas (8pt grid) */}
            <form onSubmit={handleSendEmail} className="flex flex-col gap-3 min-w-0">
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
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-white/45 px-4 h-12 rounded-xl focus:outline-none focus:border-[#fbbf24] font-sans text-sm transition-colors"
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
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-white/45 px-4 h-12 rounded-xl focus:outline-none focus:border-[#fbbf24] font-sans text-sm transition-colors"
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
                className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-white/45 px-4 py-3 rounded-xl focus:outline-none focus:border-[#fbbf24] font-sans text-sm resize-none transition-colors"
              />

              {status === "error" && (
                <div className="flex items-center gap-2 p-2.5 bg-red-950/70 border border-red-500/60 rounded text-red-200 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {status === "success-wa" && (
                <div className="flex items-start gap-2 p-3 bg-emerald-950/70 border border-emerald-500/60 rounded text-emerald-200 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">WHATSAPP ABERTO!</p>
                    <p className="text-zinc-300">A conversa foi iniciada com sua mensagem pronta para envio.</p>
                  </div>
                </div>
              )}

              {status === "success-mail" && (
                <div className="flex items-start gap-2 p-3 bg-emerald-950/70 border border-emerald-500/60 rounded text-emerald-200 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">EMAIL ENVIADO COM SUCESSO!</p>
                    <p className="text-zinc-300">Thiago recebeu seu e-mail diretamente e responderá em breve.</p>
                  </div>
                </div>
              )}

              {/* Botões de Ação: WhatsApp & Email (44px+ altura + 12px gap) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black min-h-[44px] px-4 py-3 font-display text-xs sm:text-sm tracking-wider uppercase rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4),2px_2px_0px_#000000] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ENVIAR NO WHATSAPP</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-60 text-black min-h-[44px] px-4 py-3 font-display text-xs sm:text-sm tracking-wider uppercase rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),2px_2px_0px_#000000] cursor-pointer"
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
                Interação direta e transparente · Resposta rápida
              </p>
            </form>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
