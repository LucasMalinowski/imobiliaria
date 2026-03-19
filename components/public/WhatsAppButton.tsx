'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Imovel } from '@/types'
import { gerarMensagemWhatsApp } from '@/lib/utils'

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'

interface WhatsAppButtonProps {
  imovel?: Imovel
  label?: string
  floating?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WhatsAppButton({
  imovel,
  label = 'Falar no WhatsApp',
  floating = false,
  className,
  size = 'md',
}: WhatsAppButtonProps) {
  const message = imovel
    ? gerarMensagemWhatsApp(imovel)
    : encodeURIComponent('Olá! Gostaria de informações sobre imóveis.')

  const href = `https://wa.me/${whatsappNumber}?text=${message}`

  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'fixed bottom-6 right-6 z-30 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-500/30',
          'sm:px-5 sm:py-3.5 sm:rounded-full px-4 py-4 rounded-full',
          className
        )}
        title="Falar no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 shrink-0 fill-white" />
        <span className="hidden sm:inline">{label}</span>
      </a>
    )
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-5 py-3 text-base rounded-xl',
    lg: 'px-6 py-4 text-lg rounded-xl',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg',
        sizeClasses[size],
        className
      )}
    >
      <MessageCircle
        className={cn(
          'fill-white',
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
        )}
      />
      {label}
    </a>
  )
}
