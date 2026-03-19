import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Imobiliária Premium'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliaria.com.br'

export const metadata: Metadata = {
  title: {
    default: `${siteName} | Compra, Venda e Aluguel de Imóveis`,
    template: `%s | ${siteName}`,
  },
  description: 'Encontre o imóvel dos seus sonhos. Casas, apartamentos, terrenos e imóveis comerciais para compra e aluguel.',
  keywords: ['imóveis', 'casa', 'apartamento', 'terreno', 'venda', 'aluguel', 'imobiliária'],
  authors: [{ name: siteName }],
  creator: siteName,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Compra, Venda e Aluguel de Imóveis`,
    description: 'Encontre o imóvel dos seus sonhos. Casas, apartamentos, terrenos e imóveis comerciais para compra e aluguel.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Compra, Venda e Aluguel de Imóveis`,
    description: 'Encontre o imóvel dos seus sonhos.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
