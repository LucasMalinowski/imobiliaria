import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PropertyForm } from '@/components/admin/PropertyForm'

export const metadata: Metadata = {
  title: 'Novo Imóvel | Admin',
}

export default function NovoImovelPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/imoveis"
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Novo Imóvel</h1>
          <p className="text-gray-500 mt-1">Preencha os dados para cadastrar um novo imóvel.</p>
        </div>
      </div>

      <PropertyForm mode="create" />
    </div>
  )
}
