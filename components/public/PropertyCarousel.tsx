'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Maximize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImovelImagem } from '@/types'

interface PropertyCarouselProps {
  imagens: ImovelImagem[]
  titulo: string
}

export function PropertyCarousel({ imagens, titulo }: PropertyCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreen) return
      if (e.key === 'ArrowLeft') setFullscreenIndex((i) => (i > 0 ? i - 1 : imagens.length - 1))
      if (e.key === 'ArrowRight') setFullscreenIndex((i) => (i < imagens.length - 1 ? i + 1 : 0))
      if (e.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [fullscreen, imagens.length])

  if (!imagens || imagens.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400">
        <Maximize2 className="w-16 h-16 mb-3" />
        <p className="text-lg">Sem imagens disponíveis</p>
      </div>
    )
  }

  return (
    <>
      {/* Main Carousel */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {imagens.map((imagem, index) => (
              <div key={imagem.id} className="relative flex-[0_0_100%] min-w-0">
                <div className="relative h-[400px] md:h-[520px] cursor-zoom-in">
                  <Image
                    src={imagem.url}
                    alt={`${titulo} - Foto ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                    priority={index === 0}
                    onClick={() => {
                      setFullscreenIndex(index)
                      setFullscreen(true)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {imagens.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
          {selectedIndex + 1} / {imagens.length}
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => {
            setFullscreenIndex(selectedIndex)
            setFullscreen(true)
          }}
          className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="Tela cheia"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails */}
      {imagens.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          {imagens.map((imagem, index) => (
            <button
              key={imagem.id}
              onClick={() => {
                emblaApi?.scrollTo(index)
                setSelectedIndex(index)
              }}
              className={cn(
                'relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all',
                selectedIndex === index
                  ? 'ring-2 ring-accent-500 ring-offset-1 opacity-100'
                  : 'opacity-50 hover:opacity-75'
              )}
              aria-label={`Ver foto ${index + 1}`}
            >
              <Image
                src={imagem.url}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={imagens[fullscreenIndex].url}
              alt={`${titulo} - Foto ${fullscreenIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {/* Close */}
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-11 h-11 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
              {fullscreenIndex + 1} / {imagens.length}
            </div>

            {/* Navigation */}
            {imagens.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setFullscreenIndex((i) => (i > 0 ? i - 1 : imagens.length - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setFullscreenIndex((i) => (i < imagens.length - 1 ? i + 1 : 0))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
