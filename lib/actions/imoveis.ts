'use server'

import { createClient } from '@/lib/supabase/server'
import { gerarSlug } from '@/lib/utils'
import type { Imovel, FiltrosImovel, PaginatedResult, ActionResult } from '@/types'
import type { ImovelFormData } from '@/lib/validations/imovel'

const PER_PAGE = 12

export async function getImoveis(
  filtros?: FiltrosImovel,
  page: number = 1
): Promise<PaginatedResult<Imovel>> {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * PER_PAGE

    let query = supabase
      .from('imoveis')
      .select('*, imagens:imovel_imagens(*)', { count: 'exact' })
      .eq('publicado', true)
      .order('destaque', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + PER_PAGE - 1)

    if (filtros?.finalidade) {
      query = query.eq('finalidade', filtros.finalidade)
    }
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo)
    }
    if (filtros?.cidade) {
      query = query.ilike('cidade', `%${filtros.cidade}%`)
    }
    if (filtros?.bairro) {
      query = query.ilike('bairro', `%${filtros.bairro}%`)
    }
    if (filtros?.preco_min) {
      query = query.gte('preco', filtros.preco_min)
    }
    if (filtros?.preco_max) {
      query = query.lte('preco', filtros.preco_max)
    }
    if (filtros?.quartos) {
      query = query.gte('quartos', filtros.quartos)
    }
    if (filtros?.status) {
      query = query.eq('status', filtros.status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: (data || []) as Imovel[],
      total: count || 0,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil((count || 0) / PER_PAGE),
    }
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return { data: [], total: 0, page, perPage: PER_PAGE, totalPages: 0 }
  }
}

export async function getImovelBySlug(slug: string): Promise<Imovel | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('imoveis')
      .select('*, imagens:imovel_imagens(* )')
      .eq('slug', slug)
      .eq('publicado', true)
      .single()

    if (error) return null

    if (data?.imagens) {
      data.imagens = data.imagens.sort(
        (a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem
      )
    }

    return data as Imovel
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return null
  }
}

export async function getImoveisDestaque(): Promise<Imovel[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('imoveis')
      .select('*, imagens:imovel_imagens(*)')
      .eq('publicado', true)
      .eq('destaque', true)
      .eq('status', 'disponivel')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error

    return (data || []) as Imovel[]
  } catch (error) {
    console.error('Erro ao buscar imóveis destaque:', error)
    return []
  }
}

export async function getImoveisAdmin(
  page: number = 1,
  busca?: string
): Promise<PaginatedResult<Imovel>> {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * PER_PAGE

    let query = supabase
      .from('imoveis')
      .select('*, imagens:imovel_imagens(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + PER_PAGE - 1)

    if (busca) {
      query = query.or(`titulo.ilike.%${busca}%,cidade.ilike.%${busca}%,bairro.ilike.%${busca}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: (data || []) as Imovel[],
      total: count || 0,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil((count || 0) / PER_PAGE),
    }
  } catch (error) {
    console.error('Erro ao buscar imóveis admin:', error)
    return { data: [], total: 0, page, perPage: PER_PAGE, totalPages: 0 }
  }
}

export async function getImovelById(id: string): Promise<Imovel | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('imoveis')
      .select('*, imagens:imovel_imagens(*)')
      .eq('id', id)
      .single()

    if (error) return null

    if (data?.imagens) {
      data.imagens = data.imagens.sort(
        (a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem
      )
    }

    return data as Imovel
  } catch (error) {
    console.error('Erro ao buscar imóvel por ID:', error)
    return null
  }
}

export async function createImovel(
  formData: ImovelFormData
): Promise<ActionResult<Imovel>> {
  try {
    const supabase = await createClient()

    const slug = formData.slug || gerarSlug(formData.titulo)

    // Check if slug is unique
    const { data: existing } = await supabase
      .from('imoveis')
      .select('id')
      .eq('slug', slug)
      .single()

    const finalSlug = existing
      ? `${slug}-${Date.now()}`
      : slug

    const { data, error } = await supabase
      .from('imoveis')
      .insert({
        ...formData,
        slug: finalSlug,
        area_total: formData.area_total || null,
        area_construida: formData.area_construida || null,
        cep: formData.cep || null,
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Imovel }
  } catch (error) {
    console.error('Erro ao criar imóvel:', error)
    return {
      success: false,
      error: 'Erro ao criar imóvel. Tente novamente.',
    }
  }
}

export async function updateImovel(
  id: string,
  formData: Partial<ImovelFormData>
): Promise<ActionResult<Imovel>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('imoveis')
      .update({
        ...formData,
        area_total: formData.area_total ?? null,
        area_construida: formData.area_construida ?? null,
        cep: formData.cep || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Imovel }
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error)
    return {
      success: false,
      error: 'Erro ao atualizar imóvel. Tente novamente.',
    }
  }
}

export async function deleteImovel(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('imoveis')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error)
    return {
      success: false,
      error: 'Erro ao excluir imóvel. Tente novamente.',
    }
  }
}

export async function togglePublicado(
  id: string,
  publicado: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('imoveis')
      .update({ publicado, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar publicação:', error)
    return {
      success: false,
      error: 'Erro ao atualizar publicação. Tente novamente.',
    }
  }
}

export async function toggleDestaque(
  id: string,
  destaque: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('imoveis')
      .update({ destaque, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar destaque:', error)
    return {
      success: false,
      error: 'Erro ao atualizar destaque. Tente novamente.',
    }
  }
}

export async function getEstatisticas() {
  try {
    const supabase = await createClient()

    const [
      { count: totalImoveis },
      { count: publicados },
      { count: destaques },
      { count: totalLeads },
    ] = await Promise.all([
      supabase.from('imoveis').select('*', { count: 'exact', head: true }),
      supabase.from('imoveis').select('*', { count: 'exact', head: true }).eq('publicado', true),
      supabase.from('imoveis').select('*', { count: 'exact', head: true }).eq('destaque', true),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
    ])

    return {
      totalImoveis: totalImoveis || 0,
      publicados: publicados || 0,
      destaques: destaques || 0,
      totalLeads: totalLeads || 0,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return { totalImoveis: 0, publicados: 0, destaques: 0, totalLeads: 0 }
  }
}
