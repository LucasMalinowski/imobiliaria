import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye } from 'lucide-react'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { getImovelById } from '@/lib/actions/imoveis'
import RefreshOnUpload from './RefreshOnUpload'

interface EditarImovelPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: EditarImovelPageProps): Promise<Metadata> {
  const { id } = await params
  const imovel = await getImovelById(id)
  return {
    title: imovel ? `Editar: ${imovel.titulo} | Admin` : 'Editar Imóvel | Admin',
  }
}

export default async function EditarImovelPage({ params }: EditarImovelPageProps) {
  const { id } = await params
  const imovel = await getImovelById(id)

  if (!imovel) {
    notFound()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/imoveis"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Editar Imóvel</h1>
            <p className="text-gray-500 mt-1 text-sm truncate max-w-xs md:max-w-lg">
              {imovel.titulo}
            </p>
          </div>
        </div>

        {imovel.publicado && (
          <Link
            href={`/imoveis/${imovel.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <Eye className="w-4 h-4" />
            Ver no site
          </Link>
        )}
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Fotos do Imóvel
        </h2>
        <RefreshOnUpload imovelId={imovel.id} imagens={imovel.imagens || []} />
      </div>

      {/* Property Form */}
      <PropertyForm imovel={imovel} mode="edit" />
    </div>
  )
}
