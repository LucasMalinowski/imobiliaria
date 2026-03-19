import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { Lead } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead } = body as { lead: Lead }

    if (!lead) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Send email notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Imobiliária Premium'

    if (resendApiKey && adminEmail) {
      const resend = new Resend(resendApiKey)

      await resend.emails.send({
        from: `${siteName} <noreply@${process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '').replace('http://', '') || 'imobiliaria.com.br'}>`,
        to: adminEmail,
        subject: `Novo lead: ${lead.nome} - ${lead.imovel_titulo || 'Contato geral'}`,
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Novo Lead</title>
          </head>
          <body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

              <div style="background: #1B3A5C; padding: 24px 32px;">
                <h1 style="color: white; margin: 0; font-size: 22px;">Novo Lead Recebido</h1>
                <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 14px;">${siteName}</p>
              </div>

              <div style="padding: 32px;">
                <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h2 style="margin: 0 0 16px; color: #1E293B; font-size: 16px;">Informações do Lead</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Nome:</td>
                      <td style="padding: 8px 0; color: #1E293B; font-size: 14px; font-weight: bold;">${lead.nome}</td>
                    </tr>
                    ${lead.email ? `
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">E-mail:</td>
                      <td style="padding: 8px 0; color: #1E293B; font-size: 14px;"><a href="mailto:${lead.email}" style="color: #1B3A5C;">${lead.email}</a></td>
                    </tr>` : ''}
                    ${lead.telefone ? `
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Telefone:</td>
                      <td style="padding: 8px 0; color: #1E293B; font-size: 14px;"><a href="tel:${lead.telefone}" style="color: #1B3A5C;">${lead.telefone}</a></td>
                    </tr>` : ''}
                    ${lead.imovel_titulo ? `
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Imóvel:</td>
                      <td style="padding: 8px 0; color: #1E293B; font-size: 14px;">${lead.imovel_titulo}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Data:</td>
                      <td style="padding: 8px 0; color: #1E293B; font-size: 14px;">${new Date().toLocaleString('pt-BR')}</td>
                    </tr>
                  </table>
                </div>

                ${lead.mensagem ? `
                <div style="border-left: 4px solid #D97706; padding-left: 16px; margin-bottom: 24px;">
                  <p style="color: #64748b; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">Mensagem:</p>
                  <p style="color: #1E293B; font-size: 14px; line-height: 1.6; margin: 0;">${lead.mensagem}</p>
                </div>` : ''}

                <a
                  href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/leads"
                  style="display: inline-block; background: #1B3A5C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;"
                >
                  Ver no Painel Admin
                </a>
              </div>

              <div style="padding: 16px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                  ${siteName} - Email automático, não responda.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no endpoint de leads:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
