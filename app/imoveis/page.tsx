import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { PropertyCard } from '@/components/public/PropertyCard'
import { SearchFilters } from '@/components/public/SearchFilters'
import { WhatsAppButton } from '@/components/public/WhatsAppButton'
import { PropertyGridSkeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { getImoveis } from '@/lib/actions/imoveis'
import { SlidersHorizontal, Building2 } from 'lucide-react'
import type { FiltrosImovel, Finalidade, TipoImovel, StatusImovel } from '@/types'
import PaginacaoClient from './PaginacaoClient'

export const metadata: Metadata = {
  title: 'Imóveis',
  description: 'Encontre o imóvel ideal. Casas, apartamentos, terrenos e imóveis comerciais para compra e aluguel.',
}

interface SearchParams {
  finalidade?: string
  tipo?: string
  cidade?: string
  bairro?: string
  preco_min?: string
  preco_max?: string
  quartos?: string
  page?: string
}

interface ImoveisPageProps {
  searchParams: Promise<SearchParams>
}

async function ImoveisList({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || '1', 10)

  const filtros: FiltrosImovel = {}
  if (searchParams.finalidade) filtros.finalidade = searchParams.finalidade as Finalidade
  if (searchParams.tipo) filtros.tipo = searchParams.tipo as TipoImovel
  if (searchParams.cidade) filtros.cidade = searchParams.cidade
  if (searchParams.bairro) filtros.bairro = searchParams.bairro
  if (searchParams.preco_min) filtros.preco_min = parseInt(searchParams.preco_min)
  if (searchParams.preco_max) filtros.preco_max = parseInt(searchParams.preco_max)
  if (searchParams.quartos) filtros.quartos = parseInt(searchParams.quartos)

  const result = await getImoveis(filtros, page)

  if (result.data.length === 0) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Nenhum imóvel encontrado
        </h3>
        <p className="text-gray-500">
          Tente alterar os filtros para encontrar mais opções.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-900">{result.total}</span>{' '}
          {result.total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {result.data.map((imovel) => (
          <PropertyCard key={imovel.id} imovel={imovel} />
        ))}
      </div>

      {result.totalPages > 1 && (
        <PaginacaoClient
          currentPage={result.page}
          totalPages={result.totalPages}
        />
      )}
    </div>
  )
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const params = await searchParams

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Page Header */}
        <div className="bg-primary-500 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-7 h-7 text-accent-400" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {params.finalidade === 'venda'
                    ? 'Imóveis à Venda'
                    : params.finalidade === 'aluguel'
                    ? 'Imóveis para Alugar'
                    : 'Todos os Imóveis'}
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  Encontre o imóvel ideal para você
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-72 shrink-0">
              <Suspense fallback={null}>
                <SearchFilters variant="sidebar" />
              </Suspense>
            </div>

            {/* Property Grid */}
            <div className="flex-1 min-w-0">
              <Suspense fallback={<PropertyGridSkeleton count={9} />}>
                <ImoveisList searchParams={params} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton floating />
    </>
  )
}
