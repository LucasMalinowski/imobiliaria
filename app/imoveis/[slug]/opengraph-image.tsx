import { ImageResponse } from 'next/og'
import { getImovelBySlug } from '@/lib/actions/imoveis'
import { formatarPreco, labelTipo, labelFinalidade } from '@/lib/utils'

export const runtime = 'edge'
export const alt = 'Imóvel'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: { slug: string }
}) {
  const imovel = await getImovelBySlug(params.slug)
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Imobiliária Premium'

  if (!imovel) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: '#1B3A5C',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>
            {siteName}
          </span>
        </div>
      ),
      { ...size }
    )
  }

  const localizacao = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ')

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1B3A5C 0%, #0F2035 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Company name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 'auto',
          }}
        >
          <span
            style={{
              background: '#D97706',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {siteName}
          </span>
        </div>

        {/* Property info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span
              style={{
                background: imovel.finalidade === 'venda' ? '#1B3A5C' : '#7c3aed',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              {labelFinalidade(imovel.finalidade).toUpperCase()}
            </span>
            <span
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 14,
              }}
            >
              {labelTipo(imovel.tipo)}
            </span>
          </div>

          <h1
            style={{
              color: 'white',
              fontSize: 42,
              fontWeight: 'bold',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {imovel.titulo}
          </h1>

          {localizacao && (
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 22,
                margin: 0,
              }}
            >
              📍 {localizacao}
            </p>
          )}

          <p
            style={{
              color: '#D97706',
              fontSize: 36,
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            {formatarPreco(imovel.preco)}
            {imovel.finalidade === 'aluguel' && (
              <span style={{ fontSize: 18, fontWeight: 'normal', color: 'rgba(255,255,255,0.6)' }}>
                {' '}
                /mês
              </span>
            )}
          </p>

          {/* Features */}
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            {imovel.quartos > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
                🛏 {imovel.quartos} quartos
              </span>
            )}
            {imovel.banheiros > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
                🚿 {imovel.banheiros} banheiros
              </span>
            )}
            {imovel.area_total && (
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
                📐 {imovel.area_total} m²
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
