'use server'

import { createClient } from '@/lib/supabase/server'
import type { ImovelImagem, ActionResult } from '@/types'

const BUCKET_NAME = 'imoveis-imagens'

export async function uploadImagem(
  imovelId: string,
  file: File,
  principal: boolean = false
): Promise<ActionResult<ImovelImagem>> {
  try {
    const supabase = await createClient()

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${imovelId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    // Get current max ordem for this imovel
    const { data: existingImages } = await supabase
      .from('imovel_imagens')
      .select('ordem')
      .eq('imovel_id', imovelId)
      .order('ordem', { ascending: false })
      .limit(1)

    const nextOrdem = existingImages && existingImages.length > 0
      ? (existingImages[0].ordem || 0) + 1
      : 0

    // If this is principal, unset others
    if (principal) {
      await supabase
        .from('imovel_imagens')
        .update({ principal: false })
        .eq('imovel_id', imovelId)
    }

    const { data: imagem, error: dbError } = await supabase
      .from('imovel_imagens')
      .insert({
        imovel_id: imovelId,
        url: publicUrl,
        storage_path: fileName,
        ordem: nextOrdem,
        principal: principal,
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([fileName])
      throw dbError
    }

    return { success: true, data: imagem as ImovelImagem }
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error)
    return {
      success: false,
      error: 'Erro ao fazer upload da imagem. Tente novamente.',
    }
  }
}

export async function deleteImagem(
  id: string,
  storagePath: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath])

    if (storageError) {
      console.error('Erro ao deletar arquivo do storage:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('imovel_imagens')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    return {
      success: false,
      error: 'Erro ao deletar imagem. Tente novamente.',
    }
  }
}

export async function reorderImagens(
  imagens: { id: string; ordem: number }[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const updates = imagens.map(({ id, ordem }) =>
      supabase
        .from('imovel_imagens')
        .update({ ordem })
        .eq('id', id)
    )

    await Promise.all(updates)

    return { success: true }
  } catch (error) {
    console.error('Erro ao reordenar imagens:', error)
    return {
      success: false,
      error: 'Erro ao reordenar imagens. Tente novamente.',
    }
  }
}

export async function setImagemPrincipal(
  id: string,
  imovelId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Unset all as principal for this imovel
    await supabase
      .from('imovel_imagens')
      .update({ principal: false })
      .eq('imovel_id', imovelId)

    // Set the selected one as principal
    const { error } = await supabase
      .from('imovel_imagens')
      .update({ principal: true })
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao definir imagem principal:', error)
    return {
      success: false,
      error: 'Erro ao definir imagem principal. Tente novamente.',
    }
  }
}
