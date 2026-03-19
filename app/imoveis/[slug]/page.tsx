import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  Calendar,
  Share2,
  ChevronRight,
  Home,
  Tag,
} from 'lucide-react'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { PropertyCarousel } from '@/components/public/PropertyCarousel'
import { LeadForm } from '@/components/public/LeadForm'
import { WhatsAppButton } from '@/components/public/WhatsAppButton'
import { Badge } from '@/components/ui/Badge'
import { getImovelBySlug } from '@/lib/actions/imoveis'
import {
  formatarPreco,
  formatarArea,
  formatarData,
  labelFinalidade,
  labelTipo,
  labelStatus,
} from '@/lib/utils'

interface ImovelPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ImovelPageProps): Promise<Metadata> {
  const { slug } = await params
  const imovel = await getImovelBySlug(slug)

  if (!imovel) {
    return { title: 'Imóvel não encontrado' }
  }

  const localizacao = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ')
  const imagemPrincipal = imovel.imagens?.find((img) => img.principal) || imovel.imagens?.[0]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliaria.com.br'

  return {
    title: imovel.titulo,
    description: imovel.descricao
      ? imovel.descricao.substring(0, 160)
      : `${labelTipo(imovel.tipo)} em ${localizacao} por ${formatarPreco(imovel.preco)}`,
    openGraph: {
      title: imovel.titulo,
      description: `${labelTipo(imovel.tipo)} para ${labelFinalidade(imovel.finalidade)} em ${localizacao}. ${formatarPreco(imovel.preco)}`,
      url: `${siteUrl}/imoveis/${imovel.slug}`,
      images: imagemPrincipal ? [{ url: imagemPrincipal.url }] : [],
    },
  }
}

const statusVariant = {
  disponivel: 'success',
  vendido: 'danger',
  alugado: 'info',
  reservado: 'warning',
} as const

export default async function ImovelPage({ params }: ImovelPageProps) {
  const { slug } = await params
  const imovel = await getImovelBySlug(slug)

  if (!imovel) {
    notFound()
  }

  const localizacao = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ')
  const enderecoCompleto = [imovel.endereco, imovel.bairro, imovel.cidade]
    .filter(Boolean)
    .join(', ')

  const caracteristicas = [
    imovel.quartos > 0 && { icon: BedDouble, label: `${imovel.quartos} ${imovel.quartos === 1 ? 'Quarto' : 'Quartos'}` },
    imovel.banheiros > 0 && { icon: Bath, label: `${imovel.banheiros} ${imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}` },
    imovel.vagas > 0 && { icon: Car, label: `${imovel.vagas} ${imovel.vagas === 1 ? 'Vaga' : 'Vagas'}` },
    imovel.area_total && { icon: Maximize2, label: `${formatarArea(imovel.area_total)} Total` },
    imovel.area_construida && { icon: Home, label: `${formatarArea(imovel.area_construida)} Construído` },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string }[]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-primary-500 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Início
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <Link href="/imoveis" className="hover:text-primary-500 transition-colors">
                Imóveis
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-900 font-medium truncate max-w-xs">{imovel.titulo}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Carousel */}
              <PropertyCarousel
                imagens={imovel.imagens || []}
                titulo={imovel.titulo}
              />

              {/* Property Info Card */}
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white uppercase ${
                      imovel.finalidade === 'venda' ? 'bg-primary-500' : 'bg-purple-600'
                    }`}
                  >
                    {labelFinalidade(imovel.finalidade)}
                  </span>
                  <Badge variant={statusVariant[imovel.status]} size="md">
                    {labelStatus(imovel.status)}
                  </Badge>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    {labelTipo(imovel.tipo)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {imovel.titulo}
                </h1>

                {/* Location */}
                {localizacao && (
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>{enderecoCompleto || localizacao}</span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <p className="text-4xl font-bold text-primary-500">
                    {formatarPreco(imovel.preco)}
                  </p>
                  {imovel.finalidade === 'aluguel' && (
                    <p className="text-gray-400 text-sm mt-1">/mês</p>
                  )}
                </div>

                {/* Features */}
                {caracteristicas.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
                    {caracteristicas.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {imovel.descricao && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {imovel.descricao}
                    </div>
                  </div>
                )}
              </div>

              {/* Details Table */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações do Imóvel
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Tipo', value: labelTipo(imovel.tipo) },
                    { label: 'Finalidade', value: labelFinalidade(imovel.finalidade) },
                    { label: 'Status', value: labelStatus(imovel.status) },
                    imovel.quartos > 0 && { label: 'Quartos', value: imovel.quartos },
                    imovel.banheiros > 0 && { label: 'Banheiros', value: imovel.banheiros },
                    imovel.vagas > 0 && { label: 'Vagas', value: imovel.vagas },
                    imovel.area_total && { label: 'Área Total', value: formatarArea(imovel.area_total) },
                    imovel.area_construida && { label: 'Área Construída', value: formatarArea(imovel.area_construida) },
                    imovel.cidade && { label: 'Cidade', value: imovel.cidade },
                    imovel.bairro && { label: 'Bairro', value: imovel.bairro },
                    imovel.cep && { label: 'CEP', value: imovel.cep },
                    { label: 'Cadastrado em', value: formatarData(imovel.created_at) },
                  ]
                    .filter(Boolean)
                    .map((item) => {
                      if (!item) return null
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="text-sm text-gray-500">{item.label}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {String(item.value)}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Price Card (mobile) */}
              <div className="lg:hidden bg-white rounded-2xl shadow-card p-5">
                <p className="text-3xl font-bold text-primary-500 mb-1">
                  {formatarPreco(imovel.preco)}
                </p>
                {imovel.finalidade === 'aluguel' && (
                  <p className="text-gray-400 text-sm">/mês</p>
                )}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg mb-1">Interessado?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Fale com um corretor agora pelo WhatsApp.
                </p>
                <WhatsAppButton
                  imovel={imovel}
                  label="Falar no WhatsApp"
                  className="w-full justify-center bg-white text-green-700 hover:bg-green-50 rounded-xl font-bold"
                />
              </div>

              {/* Lead Form */}
              <LeadForm
                imovelId={imovel.id}
                imovelTitulo={imovel.titulo}
              />

              {/* Share */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-accent-500" />
                  Compartilhar
                </h3>
                <ShareButtons slug={imovel.slug} titulo={imovel.titulo} />
              </div>

              {/* Reference */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Ref: {imovel.id.split('-')[0].toUpperCase()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Publicado em {formatarData(imovel.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function ShareButtons({ slug, titulo }: { slug: string; titulo: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliaria.com.br'
  const url = `${siteUrl}/imoveis/${slug}`
  const text = encodeURIComponent(`Confira este imóvel: ${titulo}`)

  return (
    <div className="flex gap-2">
      <a
        href={`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2 text-center text-sm font-medium bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2 text-center text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
      >
        Facebook
      </a>
    </div>
  )
}
