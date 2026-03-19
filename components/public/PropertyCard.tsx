import Link from 'next/link'
import Image from 'next/image'
import { MapPin, BedDouble, Bath, Car, Maximize2, MessageCircle, Eye, Star } from 'lucide-react'
import { cn, formatarPreco, formatarArea, gerarMensagemWhatsApp, labelFinalidade, labelTipo, labelStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Imovel } from '@/types'

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'

interface PropertyCardProps {
  imovel: Imovel
  className?: string
}

const statusVariant = {
  disponivel: 'success',
  vendido: 'danger',
  alugado: 'info',
  reservado: 'warning',
} as const

export function PropertyCard({ imovel, className }: PropertyCardProps) {
  const imagemPrincipal =
    imovel.imagens?.find((img) => img.principal) || imovel.imagens?.[0]
  const localizacao = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ')
  const whatsappMsg = gerarMensagemWhatsApp(imovel)

  return (
    <article
      className={cn(
        'bg-white rounded-xl shadow-card overflow-hidden group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56 bg-gray-100">
        {imagemPrincipal ? (
          <Image
            src={imagemPrincipal.url}
            alt={imovel.titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
            <Maximize2 className="w-12 h-12 mb-2" />
            <span className="text-sm">Sem imagem</span>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide',
              imovel.finalidade === 'venda' ? 'bg-primary-500' : 'bg-purple-600'
            )}
          >
            {labelFinalidade(imovel.finalidade)}
          </span>
          {imovel.destaque && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide bg-accent-500 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Destaque
            </span>
          )}
        </div>

        {/* Status badge */}
        {imovel.status !== 'disponivel' && (
          <div className="absolute top-3 right-3">
            <Badge variant={statusVariant[imovel.status]}>
              {labelStatus(imovel.status)}
            </Badge>
          </div>
        )}

        {/* Image count */}
        {imovel.imagens && imovel.imagens.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {imovel.imagens.length} fotos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type tag */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {labelTipo(imovel.tipo)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          <Link href={`/imoveis/${imovel.slug}`}>{imovel.titulo}</Link>
        </h3>

        {/* Location */}
        {localizacao && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-accent-500" />
            <span className="truncate">{localizacao}</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary-500">
            {formatarPreco(imovel.preco)}
          </p>
          {imovel.finalidade === 'aluguel' && (
            <p className="text-xs text-gray-400">/mês</p>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-gray-500 text-sm pb-4 border-b border-gray-100">
          {imovel.quartos > 0 && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-gray-400" />
              <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>
            </div>
          )}
          {imovel.banheiros > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{imovel.banheiros}</span>
            </div>
          )}
          {imovel.vagas > 0 && (
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-gray-400" />
              <span>{imovel.vagas}</span>
            </div>
          )}
          {imovel.area_total && (
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-gray-400" />
              <span>{formatarArea(imovel.area_total)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Link
            href={`/imoveis/${imovel.slug}`}
            className="flex-1 text-center px-3 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Ver detalhes
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
            title="Contato via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  )
}
