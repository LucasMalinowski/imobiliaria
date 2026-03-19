'use server'

import { createClient } from '@/lib/supabase/server'
import type { Lead, PaginatedResult, ActionResult } from '@/types'
import type { LeadFormData } from '@/lib/validations/lead'

const PER_PAGE = 20

export async function createLead(
  data: LeadFormData
): Promise<ActionResult<Lead>> {
  try {
    const supabase = await createClient()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        nome: data.nome,
        email: data.email || null,
        telefone: data.telefone || null,
        mensagem: data.mensagem || null,
        imovel_id: data.imovel_id || null,
        imovel_titulo: data.imovel_titulo || null,
      })
      .select()
      .single()

    if (error) throw error

    // Send email notification
    try {
      if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        await fetch(`${siteUrl}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead }),
        })
      }
    } catch (emailError) {
      // Email failure should not block lead creation
      console.error('Erro ao enviar e-mail de notificação:', emailError)
    }

    return { success: true, data: lead as Lead }
  } catch (error) {
    console.error('Erro ao criar lead:', error)
    return {
      success: false,
      error: 'Erro ao enviar mensagem. Tente novamente.',
    }
  }
}

export async function getLeads(
  page: number = 1,
  imovel_id?: string
): Promise<PaginatedResult<Lead>> {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * PER_PAGE

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + PER_PAGE - 1)

    if (imovel_id) {
      query = query.eq('imovel_id', imovel_id)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: (data || []) as Lead[],
      total: count || 0,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil((count || 0) / PER_PAGE),
    }
  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return { data: [], total: 0, page, perPage: PER_PAGE, totalPages: 0 }
  }
}

export async function marcarLeadLido(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('leads')
      .update({ lido: true })
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao marcar lead como lido:', error)
    return { success: false, error: 'Erro ao atualizar lead.' }
  }
}

export async function getLeadsRecentes(): Promise<Lead[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    return (data || []) as Lead[]
  } catch (error) {
    console.error('Erro ao buscar leads recentes:', error)
    return []
  }
}
