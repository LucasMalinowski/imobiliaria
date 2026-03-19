'use client'

import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { ImovelImagem } from '@/types'

interface RefreshOnUploadProps {
  imovelId: string
  imagens: ImovelImagem[]
}

export default function RefreshOnUpload({ imovelId, imagens }: RefreshOnUploadProps) {
  const router = useRouter()

  return (
    <ImageUpload
      imovelId={imovelId}
      imagens={imagens}
      onUpdate={() => router.refresh()}
    />
  )
}
