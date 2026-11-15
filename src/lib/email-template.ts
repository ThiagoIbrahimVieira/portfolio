export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  submittedAt?: string;
}

export function renderContactEmailHtml({
  name,
  email,
  message,
  submittedAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
}: ContactEmailData): string {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Dispatch de Engenharia</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #09090b; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #121215; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fef08a 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 28px 20px 28px; border-bottom: 1px solid #27272a;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #fbbf24; color: #000000; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
                      TT // THIAGO IBRAHIM
                    </span>
                    <span style="display: inline-block; margin-left: 8px; color: #a1a1aa; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 11px; letter-spacing: 0.05em;">
                      DISPATCH RECEBIDO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 14px;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                      Nova Mensagem de Contato
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
                      Enviada diretamente pelo formulário em <a href="https://portifolio-thiago-ibrahim.vercel.app/" style="color: #fbbf24; text-decoration: none;">portifolio-thiago-ibrahim.vercel.app</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Grid -->
          <tr>
            <td style="padding: 24px 28px; background-color: #17171c; border-bottom: 1px solid #27272a;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">
                      // REMETENTE
                    </span>
                    <strong style="font-size: 15px; color: #ffffff; font-weight: 600;">${safeName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">
                      // E-MAIL DE RETORNO
                    </span>
                    <a href="mailto:${safeEmail}" style="font-size: 14px; color: #fbbf24; text-decoration: none; font-weight: 500;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">
                      // TIMESTAMP
                    </span>
                    <span style="font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 12px; color: #d4d4d8;">${submittedAt} (Horário de Brasília)</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Content Box -->
          <tr>
            <td style="padding: 28px;">
              <span style="font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 10px;">
                // CONTEÚDO DA MENSAGEM
              </span>
              <div style="background-color: #0c0c0e; border: 1px solid #27272a; border-left: 4px solid #fbbf24; border-radius: 6px; padding: 18px 20px; font-size: 14px; line-height: 1.7; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${safeMessage}
              </div>

              <!-- Quick Reply Action -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=Re:%20Contato%20via%20Portf%C3%B3lio%20-%20Thiago%20Ibrahim" style="display: inline-block; background-color: #fbbf24; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.02em; text-transform: uppercase; border: 1px solid #000000; box-shadow: 2px 2px 0 #000000;">
                      Responder para ${safeName} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #0c0c0e; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-size: 11px; color: #71717a; line-height: 1.6;">
                SISTEMA DE DISPATCH AUTOMÁTICO · RESEND API<br/>
                Portfólio Thiago Ibrahim Vieira · ETEC de Itapevi
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
