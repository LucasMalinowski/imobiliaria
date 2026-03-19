'use client'

import { useState, useEffect } from 'react'
import { Save, CheckCircle2, AlertCircle, Loader2, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ConfigState {
  whatsapp: string
  nome_empresa: string
  email_contato: string
  endereco_empresa: string
  instagram: string
  facebook: string
  slogan: string
  stat1_valor: string
  stat1_label: string
  stat2_valor: string
  stat2_label: string
  stat3_valor: string
  stat3_label: string
  stat4_valor: string
  stat4_label: string
}

const DEFAULT_CONFIG: ConfigState = {
  whatsapp: '',
  nome_empresa: '',
  email_contato: '',
  endereco_empresa: '',
  instagram: '',
  facebook: '',
  slogan: '',
  stat1_valor: '500+',
  stat1_label: 'Imóveis disponíveis',
  stat2_valor: '15+',
  stat2_label: 'Anos de experiência',
  stat3_valor: '2.000+',
  stat3_label: 'Clientes satisfeitos',
  stat4_valor: '98%',
  stat4_label: 'Taxa de satisfação',
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const loadConfig = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('configuracoes').select('chave, valor')

      if (data) {
        const configMap: Partial<ConfigState> = {}
        data.forEach(({ chave, valor }) => {
          if (chave in DEFAULT_CONFIG) {
            configMap[chave as keyof ConfigState] = valor || ''
          }
        })
        setConfig((prev) => ({ ...prev, ...configMap }))
      }
      setIsLoading(false)
    }

    loadConfig()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatus('idle')

    try {
      const supabase = createClient()

      const updates = Object.entries(config).map(([chave, valor]) =>
        supabase
          .from('configuracoes')
          .upsert({ chave, valor, updated_at: new Date().toISOString() }, { onConflict: 'chave' })
      )

      await Promise.all(updates)
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setIsSaving(false)
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const handleChange = (key: keyof ConfigState, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setStatus('idle')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  const stats = [
    { valorKey: 'stat1_valor' as const, labelKey: 'stat1_label' as const, placeholder: 'ex: 500+' },
    { valorKey: 'stat2_valor' as const, labelKey: 'stat2_label' as const, placeholder: 'ex: 15+' },
    { valorKey: 'stat3_valor' as const, labelKey: 'stat3_label' as const, placeholder: 'ex: 2.000+' },
    { valorKey: 'stat4_valor' as const, labelKey: 'stat4_label' as const, placeholder: 'ex: 98%' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as informações da empresa e do site.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Empresa */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
            Informações da Empresa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nome da Empresa"
              value={config.nome_empresa}
              onChange={(e) => handleChange('nome_empresa', e.target.value)}
              placeholder="Imobiliária Premium"
            />
            <Input
              label="Slogan"
              value={config.slogan}
              onChange={(e) => handleChange('slogan', e.target.value)}
              placeholder="Encontre o imóvel dos seus sonhos"
            />
            <Input
              label="E-mail de Contato"
              type="email"
              value={config.email_contato}
              onChange={(e) => handleChange('email_contato', e.target.value)}
              placeholder="contato@imobiliaria.com.br"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Endereço da Empresa
              </label>
              <input
                type="text"
                value={config.endereco_empresa}
                onChange={(e) => handleChange('endereco_empresa', e.target.value)}
                placeholder="Rua das Flores, 123 - São Paulo, SP"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-accent-500" />
            <h2 className="text-base font-semibold text-gray-900">Estatísticas do Site</h2>
          </div>
          <p className="text-sm text-gray-400 mb-5 pb-3 border-b border-gray-100">
            Esses números aparecem no banner principal e na seção &quot;Por que nos escolher&quot;.
          </p>

          <div className="space-y-4">
            {stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Stat {i + 1} — Valor
                  </label>
                  <input
                    type="text"
                    value={config[stat.valorKey]}
                    onChange={(e) => handleChange(stat.valorKey, e.target.value)}
                    placeholder={stat.placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Stat {i + 1} — Legenda
                  </label>
                  <input
                    type="text"
                    value={config[stat.labelKey]}
                    onChange={(e) => handleChange(stat.labelKey, e.target.value)}
                    placeholder="ex: Imóveis disponíveis"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-5 p-4 bg-primary-500 rounded-xl">
            <p className="text-xs text-white/50 mb-3 uppercase tracking-wide font-medium">Pré-visualização</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-bold text-white">
                    {config[stat.valorKey] || '—'}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">
                    {config[stat.labelKey] || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
            WhatsApp
          </h2>
          <Input
            label="Número do WhatsApp"
            value={config.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="5511999999999"
            helperText="Código do país + DDD + número, sem espaços ou símbolos. Ex: 5511999999999"
          />
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
            Redes Sociais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Instagram"
              value={config.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/suaempresa"
            />
            <Input
              label="Facebook"
              value={config.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/suaempresa"
            />
          </div>
        </div>

        {/* Status messages */}
        {status === 'success' && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Configurações salvas com sucesso!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Erro ao salvar configurações. Tente novamente.
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pb-6">
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            icon={<Save className="w-4 h-4" />}
            size="lg"
          >
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  )
}
