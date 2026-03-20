'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { leadSchema, type LeadFormData } from '@/lib/validations/lead'
import { createLead } from '@/lib/actions/leads'
import { getVisitorSessionId } from '@/components/public/CookieConsent'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LeadFormProps {
  imovelId?: string
  imovelTitulo?: string
  className?: string
}

export function LeadForm({ imovelId, imovelTitulo, className }: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      imovel_id: imovelId,
      imovel_titulo: imovelTitulo,
      mensagem: imovelId ? `Olá, tenho interesse neste imóvel: ${imovelTitulo}. Por favor, entre em contato.` : '',
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    try {
      setStatus('idle')
      const sessionId = getVisitorSessionId() ?? undefined
      const result = await createLead(data, sessionId)

      if (result.success) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Erro ao enviar mensagem.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Erro inesperado. Tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-2xl p-8 text-center ${className}`}>
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Mensagem enviada com sucesso!
        </h3>
        <p className="text-gray-600 mb-6">
          Recebemos sua mensagem e entraremos em contato em breve.
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-card p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {imovelId ? 'Tenho Interesse' : 'Entre em Contato'}
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Preencha o formulário e entraremos em contato.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Hidden fields */}
        <input type="hidden" {...register('imovel_id')} />
        <input type="hidden" {...register('imovel_titulo')} />

        <Input
          label="Nome completo"
          placeholder="Seu nome"
          required
          error={errors.nome?.message}
          {...register('nome')}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Telefone / WhatsApp
          </label>
          <input
            type="tel"
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            {...register('telefone')}
          />
          {errors.telefone && (
            <p className="mt-1.5 text-sm text-red-600">{errors.telefone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mensagem
          </label>
          <textarea
            rows={4}
            placeholder="Sua mensagem..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            {...register('mensagem')}
          />
          {errors.mensagem && (
            <p className="mt-1.5 text-sm text-red-600">{errors.mensagem.message}</p>
          )}
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          variant="accent"
          loading={isSubmitting}
          icon={<Send className="w-4 h-4" />}
          className="w-full py-3.5"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Ao enviar, você concorda com nossa{' '}
          <a href="/privacidade" className="underline hover:text-gray-600">
            Política de Privacidade
          </a>
          .
        </p>
      </form>
    </div>
  )
}
