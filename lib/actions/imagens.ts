'use server'

import { createClient } from '@/lib/supabase/server'
import type { ImovelImagem, ActionResult } from '@/types'
import { BUCKET_NAME } from '@/lib/constants'

/**
 * Saves image metadata to the database AFTER the client has already
 * uploaded the file directly to Supabase Storage.
 * This avoids passing the file through the Vercel serverless payload limit.
 */
export async function saveImagemRecord(
  imovelId: string,
  publicUrl: string,
  storagePath: string,
  principal: boolean = false
): Promise<ActionResult<ImovelImagem>> {
  try {
    const supabase = await createClient()

    const { data: existingImages } = await supabase
      .from('imovel_imagens')
      .select('ordem')
      .eq('imovel_id', imovelId)
      .order('ordem', { ascending: false })
      .limit(1)

    const nextOrdem =
      existingImages && existingImages.length > 0
        ? (existingImages[0].ordem || 0) + 1
        : 0

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
        storage_path: storagePath,
        ordem: nextOrdem,
        principal,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return { success: true, data: imagem as ImovelImagem }
  } catch (error) {
    console.error('Erro ao salvar registro de imagem:', error)
    return {
      success: false,
      error: 'Erro ao salvar imagem no banco. Tente novamente.',
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
