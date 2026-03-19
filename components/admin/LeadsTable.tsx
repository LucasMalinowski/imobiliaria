'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCheck, ExternalLink, Mail, Phone, Calendar, Building2, Circle } from 'lucide-react'
import { marcarLeadLido } from '@/lib/actions/leads'
import { formatarDataHora, formatarTelefone, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Lead } from '@/types'

interface LeadsTableProps {
  leads: Lead[]
  onUpdate?: () => void
}

export function LeadsTable({ leads, onUpdate }: LeadsTableProps) {
  const [, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleMarcarLido = (id: string) => {
    setProcessingId(id)
    startTransition(async () => {
      await marcarLeadLido(id)
      setProcessingId(null)
      onUpdate?.()
    })
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium">Nenhum lead encontrado</p>
        <p className="text-sm mt-1">Os leads aparecerão aqui quando clientes enviarem mensagens.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Imóvel
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  !lead.lido && 'bg-blue-50/30'
                )}
              >
                <td className="px-4 py-4">
                  {lead.lido ? (
                    <Badge variant="default">Lido</Badge>
                  ) : (
                    <Badge variant="info">Novo</Badge>
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {!lead.lido && (
                      <Circle className="w-2 h-2 text-blue-500 fill-blue-500 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{lead.nome}</p>
                      {lead.mensagem && (
                        <p className="text-gray-500 text-xs line-clamp-1 max-w-xs mt-0.5">
                          {lead.mensagem}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-primary-500 hover:underline"
                        >
                          {lead.email}
                        </a>
                      </div>
                    )}
                    {lead.telefone && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <a
                          href={`tel:${lead.telefone}`}
                          className="hover:text-primary-500 hover:underline"
                        >
                          {formatarTelefone(lead.telefone)}
                        </a>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">
                  {lead.imovel_titulo ? (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 max-w-xs">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{lead.imovel_titulo}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {formatarDataHora(lead.created_at)}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {!lead.lido && (
                      <button
                        onClick={() => handleMarcarLido(lead.id)}
                        disabled={processingId === lead.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Marcar como lido"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Lido
                      </button>
                    )}
                    {lead.imovel_id && (
                      <Link
                        href={`/admin/imoveis/${lead.imovel_id}/editar`}
                        className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Ver imóvel"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className={cn(
              'bg-white border rounded-xl p-4 space-y-3',
              !lead.lido ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  {!lead.lido && (
                    <Circle className="w-2 h-2 text-blue-500 fill-blue-500" />
                  )}
                  <p className="font-semibold text-gray-900">{lead.nome}</p>
                </div>
                {lead.imovel_titulo && (
                  <p className="text-sm text-gray-500 mt-0.5">{lead.imovel_titulo}</p>
                )}
              </div>
              {lead.lido ? (
                <Badge variant="default">Lido</Badge>
              ) : (
                <Badge variant="info">Novo</Badge>
              )}
            </div>

            <div className="space-y-2">
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500"
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  {lead.email}
                </a>
              )}
              {lead.telefone && (
                <a
                  href={`tel:${lead.telefone}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  {formatarTelefone(lead.telefone)}
                </a>
              )}
            </div>

            {lead.mensagem && (
              <p className="text-sm text-gray-500 line-clamp-2">{lead.mensagem}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {formatarDataHora(lead.created_at)}
              </span>
              {!lead.lido && (
                <button
                  onClick={() => handleMarcarLido(lead.id)}
                  disabled={processingId === lead.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Marcar lido
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
