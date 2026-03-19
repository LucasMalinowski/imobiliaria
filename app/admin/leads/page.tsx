'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Mail, Search, Loader2, Download } from 'lucide-react'
import { getLeads } from '@/lib/actions/leads'
import { LeadsTable } from '@/components/admin/LeadsTable'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import type { Lead } from '@/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnlyNew, setShowOnlyNew] = useState(false)

  const loadLeads = useCallback(async () => {
    setIsLoading(true)
    const result = await getLeads(currentPage)
    setLeads(result.data)
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setIsLoading(false)
  }, [currentPage])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const naoLidos = leads.filter((l) => !l.lido).length
  const displayedLeads = showOnlyNew ? leads.filter((l) => !l.lido) : leads

  const handleExportCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Imóvel', 'Mensagem', 'Data', 'Status']
    const rows = leads.map((lead) => [
      lead.nome,
      lead.email || '',
      lead.telefone || '',
      lead.imovel_titulo || '',
      (lead.mensagem || '').replace(/\n/g, ' '),
      new Date(lead.created_at).toLocaleDateString('pt-BR'),
      lead.lido ? 'Lido' : 'Novo',
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">
            {total} mensagens recebidas
            {naoLidos > 0 && (
              <span className="ml-2 text-blue-600 font-semibold">
                ({naoLidos} não lidas)
              </span>
            )}
          </p>
        </div>
        <Button
          variant="secondary"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportCSV}
          disabled={leads.length === 0}
        >
          Exportar CSV
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setShowOnlyNew(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showOnlyNew
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Todos ({total})
        </button>
        <button
          onClick={() => setShowOnlyNew(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showOnlyNew
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Não lidos ({naoLidos})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="p-2">
            <LeadsTable leads={displayedLeads} onUpdate={loadLeads} />
          </div>
        )}

        {totalPages > 1 && !showOnlyNew && (
          <div className="py-4 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
