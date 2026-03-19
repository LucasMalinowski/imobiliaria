'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

export async function signIn(
  email: string,
  password: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message === 'Invalid login credentials') {
        return {
          success: false,
          error: 'E-mail ou senha incorretos.',
        }
      }
      return {
        success: false,
        error: 'Erro ao fazer login. Tente novamente.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return {
      success: false,
      error: 'Erro inesperado. Tente novamente.',
    }
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}
