import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderContactEmailHtml } from '@/lib/email-template';

const DESTINATION_EMAIL = 'thiagoibrahimvieira@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, mensagem } = body || {};

    if (!nome || typeof nome !== 'string' || !nome.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'E-mail válido é obrigatório para retorno.' }, { status: 400 });
    }

    if (!mensagem || typeof mensagem !== 'string' || !mensagem.trim()) {
      return NextResponse.json({ error: 'Mensagem é obrigatória.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY não configurada no ambiente.');
      return NextResponse.json(
        { 
          error: 'Serviço de e-mail em configuração. Por favor, adicione a chave RESEND_API_KEY no painel da Vercel.',
          needsConfig: true 
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const html = renderContactEmailHtml({
      name: nome.trim(),
      email: email.trim(),
      message: mensagem.trim(),
    });

    const { data, error } = await resend.emails.send({
      from: 'Thiago Ibrahim Portfolio <onboarding@resend.dev>',
      to: [DESTINATION_EMAIL],
      replyTo: email.trim(),
      subject: `[Dispatch Portfolio] Nova mensagem de ${nome.trim()}`,
      html,
    });

    if (error) {
      console.error('Erro retornado pelo Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno ao processar envio.';
    console.error('Erro na rota /api/contact:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
