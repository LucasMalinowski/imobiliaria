'use server'

import { createClient } from '@/lib/supabase/server'
import type { SessionData } from '@/lib/analytics/collect'
import type { ActionResult } from '@/types'

export async function saveSession(
  data: SessionData
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: session, error } = await supabase
      .from('visitor_sessions')
      .insert({
        fingerprint:          data.fingerprint ?? null,
        ip_address:           data.ip_address ?? null,
        country:              data.country ?? null,
        country_code:         data.country_code ?? null,
        region:               data.region ?? null,
        city:                 data.city ?? null,
        latitude:             data.latitude ?? null,
        longitude:            data.longitude ?? null,
        isp:                  data.isp ?? null,
        org:                  data.org ?? null,
        user_agent:           data.user_agent ?? null,
        browser:              data.browser ?? null,
        browser_version:      data.browser_version ?? null,
        os:                   data.os ?? null,
        os_version:           data.os_version ?? null,
        device_type:          data.device_type ?? 'unknown',
        screen_resolution:    data.screen_resolution ?? null,
        viewport:             data.viewport ?? null,
        color_depth:          data.color_depth ?? null,
        touch_support:        data.touch_support ?? null,
        language:             data.language ?? null,
        timezone:             data.timezone ?? null,
        cookies_enabled:      data.cookies_enabled ?? null,
        do_not_track:         data.do_not_track ?? null,
        hardware_concurrency: data.hardware_concurrency ?? null,
        device_memory:        data.device_memory ?? null,
        connection_type:      data.connection_type ?? null,
        referrer:             data.referrer ?? null,
        utm_source:           data.utm_source ?? null,
        utm_medium:           data.utm_medium ?? null,
        utm_campaign:         data.utm_campaign ?? null,
        utm_term:             data.utm_term ?? null,
        utm_content:          data.utm_content ?? null,
        landing_page:         data.landing_page ?? null,
        consent_analytics:    data.consent_analytics,
        consent_marketing:    data.consent_marketing,
        consent_timestamp:    data.consent_timestamp,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error saving session:', JSON.stringify(error))
      return { success: false, error: `DB error: ${error.message} (code: ${error.code})` }
    }

    return { success: true, data: { id: session.id } }
  } catch (error) {
    console.error('Erro ao salvar sessão:', error)
    return { success: false, error: `Erro ao salvar sessão: ${error instanceof Error ? error.message : String(error)}` }
  }
}
