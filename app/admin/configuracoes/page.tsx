'use client'

import { useState, useEffect } from 'react'
import { Save, CheckCircle2, AlertCircle, Loader2, Settings } from 'lucide-react'
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
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<ConfigState>({
    whatsapp: '',
    nome_empresa: '',
    email_contato: '',
    endereco_empresa: '',
    instagram: '',
    facebook: '',
    slogan: '',
  })
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
          if (chave in config) {
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
    } catch (err) {
      setStatus('error')
    } finally {
      setIsSaving(false)
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

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as informações da empresa e do site.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Empresa */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
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

        {/* WhatsApp */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
            WhatsApp
          </h2>
          <Input
            label="Número do WhatsApp"
            value={config.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="5511999999999"
            helperText="Formato: código do país + DDD + número, sem espaços ou símbolos. Ex: 5511999999999"
          />
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
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
