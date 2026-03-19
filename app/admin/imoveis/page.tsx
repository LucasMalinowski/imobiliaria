'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
} from 'lucide-react'
import { getImoveisAdmin, deleteImovel, togglePublicado, toggleDestaque } from '@/lib/actions/imoveis'
import { formatarPreco, labelFinalidade, labelTipo, labelStatus, formatarData, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import type { Imovel } from '@/types'

const statusVariant = {
  disponivel: 'success',
  vendido: 'danger',
  alugado: 'info',
  reservado: 'warning',
} as const

export default function AdminImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [busca, setBusca] = useState('')
  const [buscaInput, setBuscaInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; imovel: Imovel | null }>({
    open: false,
    imovel: null,
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadImoveis = useCallback(async () => {
    setIsLoading(true)
    const result = await getImoveisAdmin(currentPage, busca || undefined)
    setImoveis(result.data)
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setIsLoading(false)
  }, [currentPage, busca])

  useEffect(() => {
    loadImoveis()
  }, [loadImoveis])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setBusca(buscaInput)
    setCurrentPage(1)
  }

  const handleDelete = async () => {
    if (!deleteModal.imovel) return
    setActionLoading(deleteModal.imovel.id)
    const result = await deleteImovel(deleteModal.imovel.id)
    setDeleteModal({ open: false, imovel: null })
    setActionLoading(null)
    if (result.success) {
      loadImoveis()
    } else {
      alert(result.error)
    }
  }

  const handleTogglePublicado = async (id: string, publicado: boolean) => {
    setActionLoading(id)
    const result = await togglePublicado(id, !publicado)
    setActionLoading(null)
    if (result.success) {
      setImoveis((prev) =>
        prev.map((i) => (i.id === id ? { ...i, publicado: !publicado } : i))
      )
    }
  }

  const handleToggleDestaque = async (id: string, destaque: boolean) => {
    setActionLoading(id)
    const result = await toggleDestaque(id, !destaque)
    setActionLoading(null)
    if (result.success) {
      setImoveis((prev) =>
        prev.map((i) => (i.id === id ? { ...i, destaque: !destaque } : i))
      )
    }
  }

  const imagemPrincipal = (imovel: Imovel) =>
    imovel.imagens?.find((img) => img.principal) || imovel.imagens?.[0]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Imóveis</h1>
          <p className="text-gray-500 mt-1">{total} imóveis cadastrados</p>
        </div>
        <Link href="/admin/imoveis/novo">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, cidade, bairro..."
            value={buscaInput}
            onChange={(e) => setBuscaInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Buscar
        </Button>
        {busca && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              setBusca('')
              setBuscaInput('')
              setCurrentPage(1)
            }}
          >
            Limpar
          </Button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : imoveis.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-700">Nenhum imóvel encontrado</p>
            <p className="text-gray-400 text-sm mt-1">
              {busca ? 'Tente uma busca diferente.' : 'Crie o primeiro imóvel.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tipo/Finalidade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Publicado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {imoveis.map((imovel) => {
                    const thumb = imagemPrincipal(imovel)
                    return (
                      <tr key={imovel.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {thumb ? (
                                <Image
                                  src={thumb.url}
                                  alt={imovel.titulo}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate max-w-xs">
                                {imovel.titulo}
                              </p>
                              {(imovel.bairro || imovel.cidade) && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700">{labelTipo(imovel.tipo)}</p>
                            <span
                              className={cn(
                                'inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white',
                                imovel.finalidade === 'venda' ? 'bg-primary-500' : 'bg-purple-600'
                              )}
                            >
                              {labelFinalidade(imovel.finalidade)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatarPreco(imovel.preco)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={statusVariant[imovel.status]}>
                            {labelStatus(imovel.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePublicado(imovel.id, imovel.publicado)}
                              disabled={actionLoading === imovel.id}
                              className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                imovel.publicado ? 'bg-green-500' : 'bg-gray-200'
                              )}
                            >
                              <span
                                className={cn(
                                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                  imovel.publicado ? 'translate-x-4' : 'translate-x-0'
                                )}
                              />
                            </button>
                            <span className="text-xs text-gray-500">
                              {imovel.publicado ? 'Sim' : 'Não'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs text-gray-500">{formatarData(imovel.created_at)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggleDestaque(imovel.id, imovel.destaque)}
                              disabled={actionLoading === imovel.id}
                              title={imovel.destaque ? 'Remover destaque' : 'Marcar como destaque'}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                imovel.destaque
                                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                  : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'
                              )}
                            >
                              <Star className={cn('w-4 h-4', imovel.destaque && 'fill-amber-500')} />
                            </button>

                            {imovel.publicado && (
                              <Link
                                href={`/imoveis/${imovel.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                title="Ver no site"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}

                            <Link
                              href={`/admin/imoveis/${imovel.id}/editar`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => setDeleteModal({ open: true, imovel })}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {imoveis.map((imovel) => {
                const thumb = imagemPrincipal(imovel)
                return (
                  <div key={imovel.id} className="p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {thumb ? (
                          <Image src={thumb.url} alt={imovel.titulo} fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {imovel.titulo}
                        </p>
                        <p className="text-accent-500 font-bold mt-1">{formatarPreco(imovel.preco)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={statusVariant[imovel.status]}>{labelStatus(imovel.status)}</Badge>
                      <Badge variant={imovel.publicado ? 'success' : 'default'}>
                        {imovel.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      {imovel.destaque && <Badge variant="warning">Destaque</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/imoveis/${imovel.id}/editar`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full" icon={<Edit2 className="w-3.5 h-3.5" />}>
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ open: true, imovel })}
                        icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                iconPosition="right"
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, imovel: null })}
        onConfirm={handleDelete}
        title="Excluir Imóvel"
        message={`Tem certeza que deseja excluir "${deleteModal.imovel?.titulo}"? Esta ação não pode ser desfeita e todas as imagens serão perdidas.`}
        confirmLabel="Excluir Imóvel"
        loading={actionLoading === deleteModal.imovel?.id}
      />
    </div>
  )
}
