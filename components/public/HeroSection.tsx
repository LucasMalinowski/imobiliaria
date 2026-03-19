'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, Home, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatItem {
  value: string
  label: string
}

interface HeroSectionProps {
  stats?: StatItem[]
}

const DEFAULT_STATS: StatItem[] = [
  { value: '500+', label: 'Imóveis disponíveis' },
  { value: '15+', label: 'Anos de experiência' },
  { value: '2.000+', label: 'Clientes satisfeitos' },
  { value: '98%', label: 'Taxa de satisfação' },
]

const STAT_ICONS = [Home, TrendingUp, Award, Search]

export function HeroSection({ stats = DEFAULT_STATS }: HeroSectionProps) {
  const router = useRouter()
  const [finalidade, setFinalidade] = useState('venda')
  const [busca, setBusca] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (finalidade) params.set('finalidade', finalidade)
    if (busca.trim()) {
      // Try to determine if it's a city or neighborhood
      params.set('cidade', busca.trim())
    }
    router.push(`/imoveis?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`,
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-900/60 to-primary-900/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/40 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <Award className="w-4 h-4" />
            Imobiliária Premium de Confiança
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
            Encontre o imóvel{' '}
            <span className="text-accent-400">dos seus sonhos</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Casas, apartamentos, terrenos e imóveis comerciais. Compra, venda e
            aluguel com segurança e transparência.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-12">
            {/* Finalidade tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 shrink-0">
              <button
                onClick={() => setFinalidade('venda')}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  finalidade === 'venda'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                )}
              >
                Comprar
              </button>
              <button
                onClick={() => setFinalidade('aluguel')}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  finalidade === 'aluguel'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                )}
              >
                Alugar
              </button>
            </div>

            {/* Search input */}
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Cidade, bairro ou tipo de imóvel..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 py-2.5 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none text-sm"
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/60">Busca rápida:</span>
            {[
              { label: 'Casas à Venda', query: '?finalidade=venda&tipo=casa' },
              { label: 'Apartamentos', query: '?tipo=apartamento' },
              { label: 'Para Alugar', query: '?finalidade=aluguel' },
              { label: 'Terrenos', query: '?tipo=terreno' },
            ].map((item) => (
              <a
                key={item.query}
                href={`/imoveis${item.query}`}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-md rounded-t-2xl shadow-2xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-5 divide-x divide-gray-100">
            {stats.map(({ value, label }, i) => {
              const Icon = STAT_ICONS[i] ?? Home
              return (
                <div key={i} className="text-center pl-5 first:pl-0">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-accent-500" />
                    <span className="text-2xl font-bold text-primary-500">{value}</span>
                  </div>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
