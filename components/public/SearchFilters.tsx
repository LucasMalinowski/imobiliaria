'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'

const tipoOptions = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'studio', label: 'Studio' },
  { value: 'sobrado', label: 'Sobrado' },
  { value: 'chacara', label: 'Chácara' },
  { value: 'galpao', label: 'Galpão' },
]

const quartosOptions = [
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

interface SearchFiltersProps {
  className?: string
  variant?: 'sidebar' | 'horizontal'
}

export function SearchFilters({ className, variant = 'sidebar' }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const [filters, setFilters] = useState({
    finalidade: searchParams.get('finalidade') || '',
    tipo: searchParams.get('tipo') || '',
    cidade: searchParams.get('cidade') || '',
    bairro: searchParams.get('bairro') || '',
    preco_min: searchParams.get('preco_min') || '',
    preco_max: searchParams.get('preco_max') || '',
    quartos: searchParams.get('quartos') || '',
  })

  const hasFilters = Object.values(filters).some(Boolean)

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
    setMobileOpen(false)
  }, [filters, pathname, router])

  const clearFilters = useCallback(() => {
    setFilters({
      finalidade: '',
      tipo: '',
      cidade: '',
      bairro: '',
      preco_min: '',
      preco_max: '',
      quartos: '',
    })
    router.push(pathname)
    setMobileOpen(false)
  }, [pathname, router])

  const FilterContent = (
    <div className="space-y-5">
      {/* Finalidade */}
      <Select
        label="Finalidade"
        value={filters.finalidade}
        onChange={(e) => setFilters((prev) => ({ ...prev, finalidade: e.target.value }))}
        options={[
          { value: 'venda', label: 'Venda' },
          { value: 'aluguel', label: 'Aluguel' },
        ]}
        placeholder="Todas"
      />

      {/* Tipo */}
      <Select
        label="Tipo de Imóvel"
        value={filters.tipo}
        onChange={(e) => setFilters((prev) => ({ ...prev, tipo: e.target.value }))}
        options={tipoOptions}
        placeholder="Todos os tipos"
      />

      {/* Cidade */}
      <Input
        label="Cidade"
        placeholder="Ex: São Paulo"
        value={filters.cidade}
        onChange={(e) => setFilters((prev) => ({ ...prev, cidade: e.target.value }))}
      />

      {/* Bairro */}
      <Input
        label="Bairro"
        placeholder="Ex: Moema"
        value={filters.bairro}
        onChange={(e) => setFilters((prev) => ({ ...prev, bairro: e.target.value }))}
      />

      {/* Preço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Faixa de Preço (R$)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Mínimo"
            type="number"
            value={filters.preco_min}
            onChange={(e) => setFilters((prev) => ({ ...prev, preco_min: e.target.value }))}
          />
          <Input
            placeholder="Máximo"
            type="number"
            value={filters.preco_max}
            onChange={(e) => setFilters((prev) => ({ ...prev, preco_max: e.target.value }))}
          />
        </div>
      </div>

      {/* Quartos */}
      <Select
        label="Quartos"
        value={filters.quartos}
        onChange={(e) => setFilters((prev) => ({ ...prev, quartos: e.target.value }))}
        options={quartosOptions}
        placeholder="Qualquer"
      />

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <Button
          variant="primary"
          className="w-full"
          onClick={applyFilters}
          icon={<Search className="w-4 h-4" />}
        >
          Buscar Imóveis
        </Button>
        {hasFilters && (
          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={clearFilters}
            icon={<X className="w-4 h-4" />}
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  )

  if (variant === 'horizontal') {
    return (
      <div className={cn('bg-white rounded-2xl shadow-card p-4', className)}>
        {FilterContent}
      </div>
    )
  }

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setMobileOpen(true)}
          icon={<SlidersHorizontal className="w-4 h-4" />}
          className="w-full"
        >
          Filtrar Imóveis
          {hasFilters && (
            <span className="ml-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-lg text-gray-900">Filtros</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">{FilterContent}</div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:block bg-white rounded-2xl shadow-card p-6 sticky top-24',
          className
        )}
      >
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="w-5 h-5 text-primary-500" />
          <h2 className="font-semibold text-lg text-gray-900">Filtrar</h2>
          {hasFilters && (
            <span className="ml-auto bg-accent-100 text-accent-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {Object.values(filters).filter(Boolean).length} ativos
            </span>
          )}
        </div>
        {FilterContent}
      </div>
    </>
  )
}
