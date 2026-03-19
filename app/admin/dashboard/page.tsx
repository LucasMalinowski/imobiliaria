import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  Users,
  Globe,
  Star,
  Plus,
  ArrowRight,
  Mail,
  Eye,
} from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { LeadsTable } from '@/components/admin/LeadsTable'
import { Badge } from '@/components/ui/Badge'
import { getEstatisticas } from '@/lib/actions/imoveis'
import { getLeadsRecentes } from '@/lib/actions/leads'
import { formatarPreco, labelStatus, formatarData } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
}

const statusVariant = {
  disponivel: 'success',
  vendido: 'danger',
  alugado: 'info',
  reservado: 'warning',
} as const

export default async function DashboardPage() {
  const [stats, leadsRecentes] = await Promise.all([
    getEstatisticas(),
    getLeadsRecentes(),
  ])

  const naoLidos = leadsRecentes.filter((l) => !l.lido).length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo ao painel de controle.{' '}
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total de Imóveis"
          value={stats.totalImoveis}
          icon={<Building2 className="w-6 h-6" />}
          description="Todos os imóveis cadastrados"
          color="navy"
        />
        <StatsCard
          title="Publicados"
          value={stats.publicados}
          icon={<Globe className="w-6 h-6" />}
          description="Visíveis no site"
          color="green"
        />
        <StatsCard
          title="Destaques"
          value={stats.destaques}
          icon={<Star className="w-6 h-6" />}
          description="Na página inicial"
          color="amber"
        />
        <StatsCard
          title="Leads Recebidos"
          value={stats.totalLeads}
          icon={<Users className="w-6 h-6" />}
          description={naoLidos > 0 ? `${naoLidos} não lidos` : 'Todas mensagens'}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/imoveis/novo"
            className="flex flex-col items-center gap-2 p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-semibold">Novo Imóvel</span>
          </Link>
          <Link
            href="/admin/imoveis"
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-100 transition-colors shadow-card"
          >
            <Building2 className="w-6 h-6 text-primary-500" />
            <span className="text-sm font-semibold">Ver Imóveis</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-100 transition-colors shadow-card relative"
          >
            <Mail className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-semibold">Ver Leads</span>
            {naoLidos > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {naoLidos > 9 ? '9+' : naoLidos}
              </span>
            )}
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-100 transition-colors shadow-card"
          >
            <Eye className="w-6 h-6 text-green-600" />
            <span className="text-sm font-semibold">Ver Site</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">Leads Recentes</h2>
              {naoLidos > 0 && (
                <Badge variant="info">{naoLidos} novos</Badge>
              )}
            </div>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1 text-sm text-primary-500 hover:text-accent-500 font-medium transition-colors"
            >
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-2">
            <LeadsTable leads={leadsRecentes.slice(0, 5)} />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Resumo</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Total de imóveis</span>
                <span className="font-semibold text-gray-900">{stats.totalImoveis}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Publicados</span>
                <span className="font-semibold text-green-600">{stats.publicados}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Rascunhos</span>
                <span className="font-semibold text-gray-500">
                  {stats.totalImoveis - stats.publicados}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Destaques</span>
                <span className="font-semibold text-amber-600">{stats.destaques}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">Total de leads</span>
                <span className="font-semibold text-purple-600">{stats.totalLeads}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-5 text-white">
            <h3 className="font-semibold mb-2">Dica</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Marque imóveis como <strong className="text-white">Destaque</strong> para
              exibi-los na página inicial e aumentar a visibilidade.
            </p>
            <Link
              href="/admin/imoveis"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              Gerenciar imóveis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
