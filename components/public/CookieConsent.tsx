'use client'

import { useState, useEffect } from 'react'
import { Cookie, Settings2, ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { collectVisitorData, type ConsentTypes } from '@/lib/analytics/collect'
import { saveSession } from '@/lib/actions/sessions'
import { cn } from '@/lib/utils'

const STORAGE_KEY  = '_cc'   // consent preferences
const SESSION_KEY  = '_vsid' // visitor session id

interface StoredConsent {
  essential: true
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getVisitorSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

// ── Component ────────────────────────────────────────────────

export function CookieConsent() {
  const [visible, setVisible]     = useState(false)
  const [expanded, setExpanded]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [prefs, setPrefs] = useState<Omit<ConsentTypes, never>>({
    analytics: true,
    marketing: true,
  })

  useEffect(() => {
    // Show banner only if consent hasn't been given yet
    if (!getStoredConsent()) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const persist = async (consent: ConsentTypes) => {
    setSaving(true)

    // Save consent to localStorage
    const stored: StoredConsent = {
      essential: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    // Also set a cookie for server-side detection
    document.cookie = `${STORAGE_KEY}=1; max-age=31536000; path=/; SameSite=Lax`

    // Collect visitor data and save session
    try {
      const sessionData = await collectVisitorData(consent)
      const result = await saveSession(sessionData)
      if (result.success && result.data?.id) {
        localStorage.setItem(SESSION_KEY, result.data.id)
      }
    } catch {
      // Session collection failure is non-blocking
    }

    setSaving(false)
    setVisible(false)
  }

  const acceptAll = () => persist({ analytics: true, marketing: true })
  const essentialOnly = () => persist({ analytics: false, marketing: false })
  const saveCustom = () => persist(prefs)

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6',
        'animate-in slide-in-from-bottom-4 duration-500'
      )}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-base font-bold text-gray-900">
                Privacidade e Cookies
              </h2>
              <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                <Shield className="w-3.5 h-3.5" />
                LGPD
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdos.
              Seus dados são tratados conforme a{' '}
              <a href="/privacidade" className="underline text-primary-500 hover:text-primary-600">
                Lei nº 13.709/2018 (LGPD)
              </a>
              .
            </p>
          </div>
        </div>

        {/* Expandable preferences */}
        {expanded && (
          <div className="px-5 sm:px-6 pb-2 border-t border-gray-50">
            <div className="pt-4 space-y-3">
              {/* Essential — always on */}
              <Toggle
                label="Essenciais"
                description="Necessários para o funcionamento do site. Não podem ser desativados."
                checked={true}
                disabled
                onChange={() => {}}
              />
              <Toggle
                label="Análise e performance"
                description="Dados de dispositivo, navegador, localização aproximada e impressão digital para entender como você usa o site."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <Toggle
                label="Marketing e rastreamento"
                description="Origem da visita (UTM), páginas visitadas e dados de campanha para otimizar anúncios."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mr-auto"
          >
            <Settings2 className="w-4 h-4" />
            {expanded ? 'Ocultar' : 'Gerenciar preferências'}
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {expanded ? (
              <button
                onClick={saveCustom}
                disabled={saving}
                className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Salvar seleção
              </button>
            ) : (
              <button
                onClick={essentialOnly}
                disabled={saving}
                className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Somente essenciais
              </button>
            )}

            <button
              onClick={acceptAll}
              disabled={saving}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 min-w-[120px]"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : null}
              Aceitar todos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Toggle sub-component ─────────────────────────────────────

interface ToggleProps {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}

function Toggle({ label, description, checked, disabled, onChange }: ToggleProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-primary-500' : 'bg-gray-200',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  )
}
