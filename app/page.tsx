import Link from 'next/link'
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { HeroSection } from '@/components/public/HeroSection'
import { PropertyCard } from '@/components/public/PropertyCard'
import { PropertyTypeGrid } from '@/components/public/PropertyTypeGrid'
import { WhatsAppButton } from '@/components/public/WhatsAppButton'
import { getImoveisDestaque } from '@/lib/actions/imoveis'

export default async function HomePage() {
  const imoveisDestaque = await getImoveisDestaque()

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Properties */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="inline-block text-accent-500 font-semibold text-sm uppercase tracking-wider mb-3">
                  Selecionados para você
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-500">
                  Imóveis em Destaque
                </h2>
              </div>
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-accent-500 font-semibold transition-colors group shrink-0"
              >
                Ver todos os imóveis
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {imoveisDestaque.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imoveisDestaque.map((imovel) => (
                  <PropertyCard key={imovel.id} imovel={imovel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-gray-400 text-lg">
                  Em breve novos imóveis em destaque.
                </p>
                <Link
                  href="/imoveis"
                  className="inline-flex items-center gap-2 mt-4 text-primary-500 font-semibold hover:text-accent-500 transition-colors"
                >
                  Ver todos os imóveis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Property Types */}
        <PropertyTypeGrid />

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-accent-500 font-semibold text-sm uppercase tracking-wider mb-4">
                  Por que nos escolher
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6">
                  Experiência e confiança no mercado imobiliário
                </h2>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  Há mais de 15 anos ajudando famílias e empresas a encontrar o
                  imóvel ideal. Nosso compromisso é com a transparência, segurança
                  e satisfação de cada cliente.
                </p>

                <div className="space-y-4">
                  {[
                    'Assessoria completa na compra, venda e aluguel',
                    'Documentação e regularização de imóveis',
                    'Avaliação gratuita do seu imóvel',
                    'Financiamento e análise de crédito',
                    'Atendimento personalizado e humanizado',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/imoveis"
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-md"
                  >
                    Ver Imóveis
                  </Link>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Falar Conosco
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: '15+', label: 'Anos no mercado', color: 'bg-primary-500' },
                  { value: '500+', label: 'Imóveis vendidos', color: 'bg-accent-500' },
                  { value: '2.000+', label: 'Clientes atendidos', color: 'bg-green-500' },
                  { value: '98%', label: 'De satisfação', color: 'bg-purple-600' },
                ].map(({ value, label, color }) => (
                  <div
                    key={label}
                    className={`${color} rounded-2xl p-8 text-white text-center shadow-lg`}
                  >
                    <p className="text-4xl font-bold mb-2">{value}</p>
                    <p className="text-sm text-white/80">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Encontrou o imóvel ideal?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Entre em contato conosco agora mesmo e realize o sonho de ter seu
              imóvel. Nossa equipe está pronta para te atender.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'}?text=${encodeURIComponent('Olá! Gostaria de informações sobre imóveis.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors shadow-lg text-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Falar no WhatsApp
              </a>
              <Link
                href="/imoveis"
                className="flex items-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold rounded-xl transition-colors text-lg"
              >
                Ver Imóveis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppButton floating label="Falar no WhatsApp" />
    </>
  )
}
