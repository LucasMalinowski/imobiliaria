'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X, Star, Loader2, ImagePlus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { saveImagemRecord, deleteImagem, setImagemPrincipal } from '@/lib/actions/imagens'
import { BUCKET_NAME } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { ImovelImagem } from '@/types'

interface ImageUploadProps {
  imovelId: string
  imagens: ImovelImagem[]
  onUpdate: () => void
}

interface UploadState {
  name: string
  progress: 'uploading' | 'success' | 'error'
  error?: string
}

export function ImageUpload({ imovelId, imagens, onUpdate }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadState[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingPrincipalId, setSettingPrincipalId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'))
      if (imageFiles.length === 0) return

      setUploads(imageFiles.map((f) => ({ name: f.name, progress: 'uploading' })))

      const supabase = createClient()

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const isPrincipal = imagens.length === 0 && i === 0
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const storagePath = `${imovelId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        try {
          // Upload directly from browser → Supabase Storage (no Vercel payload limit)
          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, file, { cacheControl: '3600', upsert: false })

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath)

          // Only the tiny metadata goes through the Server Action
          const result = await saveImagemRecord(imovelId, publicUrl, storagePath, isPrincipal)

          if (result.success) {
            setUploads((prev) =>
              prev.map((u) => (u.name === file.name ? { ...u, progress: 'success' } : u))
            )
            onUpdate()
          } else {
            // Clean up orphaned storage file
            await supabase.storage.from(BUCKET_NAME).remove([storagePath])
            setUploads((prev) =>
              prev.map((u) =>
                u.name === file.name ? { ...u, progress: 'error', error: result.error } : u
              )
            )
          }
        } catch (err) {
          console.error(err)
          setUploads((prev) =>
            prev.map((u) =>
              u.name === file.name ? { ...u, progress: 'error', error: 'Erro ao enviar' } : u
            )
          )
        }
      }

      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.progress !== 'success'))
      }, 3000)
    },
    [imovelId, imagens.length, onUpdate]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(Array.from(e.dataTransfer.files))
    },
    [handleFiles]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (imagem: ImovelImagem) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return
    setDeletingId(imagem.id)
    const result = await deleteImagem(imagem.id, imagem.storage_path)
    setDeletingId(null)
    if (result.success) onUpdate()
    else alert(result.error || 'Erro ao excluir imagem')
  }

  const handleSetPrincipal = async (imagem: ImovelImagem) => {
    if (imagem.principal) return
    setSettingPrincipalId(imagem.id)
    const result = await setImagemPrincipal(imagem.id, imovelId)
    setSettingPrincipalId(null)
    if (result.success) onUpdate()
    else alert(result.error || 'Erro ao definir imagem principal')
  }

  return (
    <div className="space-y-5">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-accent-500 bg-amber-50'
            : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <ImagePlus
          className={cn(
            'w-12 h-12 mx-auto mb-4 transition-colors',
            isDragging ? 'text-accent-500' : 'text-gray-300'
          )}
        />
        <p className="text-base font-medium text-gray-700 mb-1">
          {isDragging ? 'Solte as imagens aqui' : 'Clique ou arraste imagens'}
        </p>
        <p className="text-sm text-gray-400">PNG, JPG, WEBP. Múltiplos arquivos permitidos.</p>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border',
                upload.progress === 'uploading'
                  ? 'bg-blue-50 border-blue-100'
                  : upload.progress === 'success'
                  ? 'bg-green-50 border-green-100'
                  : 'bg-red-50 border-red-100'
              )}
            >
              {upload.progress === 'uploading' ? (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              ) : upload.progress === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span className="flex-1 text-sm text-gray-700 truncate">{upload.name}</span>
              <span className="text-xs text-gray-500">
                {upload.progress === 'uploading'
                  ? 'Enviando...'
                  : upload.progress === 'success'
                  ? 'Concluído!'
                  : upload.error || 'Erro'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Images Grid */}
      {imagens.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {imagens.length} {imagens.length === 1 ? 'imagem' : 'imagens'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imagens.map((imagem) => (
              <div
                key={imagem.id}
                className={cn(
                  'relative group rounded-xl overflow-hidden border-2 transition-all',
                  imagem.principal
                    ? 'border-accent-500 shadow-md'
                    : 'border-transparent hover:border-gray-200'
                )}
              >
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={imagem.url}
                    alt={`Imagem ${imagem.ordem + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>

                {imagem.principal && (
                  <div className="absolute top-1.5 left-1.5 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Principal
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!imagem.principal && (
                    <button
                      onClick={() => handleSetPrincipal(imagem)}
                      disabled={settingPrincipalId === imagem.id}
                      className="p-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
                      title="Definir como principal"
                    >
                      {settingPrincipalId === imagem.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(imagem)}
                    disabled={deletingId === imagem.id}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Excluir imagem"
                  >
                    {deletingId === imagem.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {imagens.length === 0 && uploads.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">
          Nenhuma imagem adicionada ainda.
        </p>
      )}
    </div>
  )
}
