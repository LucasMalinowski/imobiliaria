import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Imovel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarPreco(preco: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(preco)
}

export function formatarArea(area: number): string {
  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(area)} m²`
}

export function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function gerarMensagemWhatsApp(imovel: Imovel): string {
  const preco = formatarPreco(imovel.preco)
  const finalidade = imovel.finalidade === 'venda' ? 'venda' : 'aluguel'
  const localizacao = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ')

  const mensagem = `Olá! Tenho interesse no imóvel:

*${imovel.titulo}*
📍 ${localizacao || 'Ver localização'}
💰 ${preco} (${finalidade})
🔗 ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliaria.com.br'}/imoveis/${imovel.slug}

Poderia me dar mais informações?`

  return encodeURIComponent(mensagem)
}

export function formatarTelefone(tel: string): string {
  const numeros = tel.replace(/\D/g, '')

  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return tel
}

export function formatarData(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(data))
}

export function formatarDataHora(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data))
}

export function labelFinalidade(finalidade: string): string {
  return finalidade === 'venda' ? 'Venda' : 'Aluguel'
}

export function labelTipo(tipo: string): string {
  const labels: Record<string, string> = {
    casa: 'Casa',
    apartamento: 'Apartamento',
    terreno: 'Terreno',
    comercial: 'Comercial',
    rural: 'Rural',
    cobertura: 'Cobertura',
    studio: 'Studio',
    sobrado: 'Sobrado',
    chacara: 'Chácara',
    galpao: 'Galpão',
  }
  return labels[tipo] || tipo
}

export function labelStatus(status: string): string {
  const labels: Record<string, string> = {
    disponivel: 'Disponível',
    vendido: 'Vendido',
    alugado: 'Alugado',
    reservado: 'Reservado',
  }
  return labels[status] || status
}

export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto
  return texto.substring(0, maxLength).trim() + '...'
}
