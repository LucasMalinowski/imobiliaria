'use client'

// ============================================================
// Client-side visitor data collection (no paid tools needed)
// Only runs after the user gives consent.
// ============================================================

export interface ConsentTypes {
  analytics: boolean
  marketing: boolean
}

export interface SessionData {
  fingerprint?: string
  ip_address?: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  isp?: string
  org?: string
  user_agent?: string
  browser?: string
  browser_version?: string
  os?: string
  os_version?: string
  device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  screen_resolution?: string
  viewport?: string
  color_depth?: number
  touch_support?: boolean
  language?: string
  timezone?: string
  cookies_enabled?: boolean
  do_not_track?: boolean
  hardware_concurrency?: number
  device_memory?: number
  connection_type?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  landing_page?: string
  consent_analytics: boolean
  consent_marketing: boolean
  consent_timestamp: string
}

// ── Utilities ───────────────────────────────────────────────

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

function canvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 60
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'no-canvas'

    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#1B3A5C'
    ctx.fillRect(0, 0, 300, 60)
    ctx.fillStyle = '#D97706'
    ctx.font = 'bold 16px Arial, Helvetica, sans-serif'
    ctx.fillText('imobiliária.fp 🏠', 10, 30)
    ctx.fillStyle = 'rgba(255, 99, 71, 0.6)'
    ctx.font = '11px Georgia, serif'
    ctx.fillText('αβγδε ©2025 \u262F', 10, 48)

    return hashString(canvas.toDataURL())
  } catch {
    return 'canvas-blocked'
  }
}

function webglFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return 'no-webgl'

    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const vendor   = ext ? (gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   as string) : 'unknown'
    const renderer = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string) : 'unknown'

    return hashString(`${vendor}::${renderer}`)
  } catch {
    return 'webgl-blocked'
  }
}

function buildFingerprint(): string {
  const parts = [
    canvasFingerprint(),
    webglFingerprint(),
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    navigator.hardwareConcurrency?.toString() ?? '',
    navigator.platform,
  ]
  return hashString(parts.join('|'))
}

interface ParsedUA {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown'
}

function parseUserAgent(ua: string): ParsedUA {
  const browsers: [string, RegExp][] = [
    ['Edge',    /Edg\/([\d.]+)/],
    ['Chrome',  /Chrome\/([\d.]+)/],
    ['Firefox', /Firefox\/([\d.]+)/],
    ['Safari',  /Version\/([\d.]+).*Safari/],
    ['Opera',   /OPR\/([\d.]+)/],
  ]
  const oses: [string, RegExp][] = [
    ['Windows', /Windows NT ([\d.]+)/],
    ['macOS',   /Mac OS X ([\d_.]+)/],
    ['iOS',     /(?:iPhone|iPad) OS ([\d_]+)/],
    ['Android', /Android ([\d.]+)/],
    ['Linux',   /Linux/],
  ]

  let browser = 'Unknown', browserVersion = ''
  for (const [name, re] of browsers) {
    const m = ua.match(re)
    if (m) { browser = name; browserVersion = m[1]?.split('.')[0] ?? ''; break }
  }

  let os = 'Unknown', osVersion = ''
  for (const [name, re] of oses) {
    const m = ua.match(re)
    if (m) {
      os = name
      osVersion = (m[1] ?? '').replace(/_/g, '.')
      break
    }
  }

  const isTablet  = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))
  const isMobile  = /Mobile|Android|iPhone|iPod/i.test(ua)
  const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  return { browser, browserVersion, os, osVersion, deviceType }
}

function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source:   params.get('utm_source')   ?? '',
    utm_medium:   params.get('utm_medium')   ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_term:     params.get('utm_term')     ?? '',
    utm_content:  params.get('utm_content')  ?? '',
  }
}

interface IPData {
  ip?: string
  country_name?: string
  country_code?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  isp?: string   // parsed from org field
  org?: string
}

async function getIPLocation(): Promise<IPData> {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error('ipapi error')
    const d = await res.json()
    return {
      ip:           d.ip,
      country_name: d.country_name,
      country_code: d.country_code,
      region:       d.region,
      city:         d.city,
      latitude:     d.latitude,
      longitude:    d.longitude,
      org:          d.org,
      // ipapi.co puts ISP info in `org` — extract the name part after "AS12345 "
      isp: d.org ? d.org.replace(/^AS\d+\s+/, '') : undefined,
    }
  } catch {
    // Fallback to freeipapi.com
    try {
      const res = await fetch('https://freeipapi.com/api/json', {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) throw new Error('freeipapi error')
      const d = await res.json()
      return {
        ip:           d.ipAddress,
        country_name: d.countryName,
        country_code: d.countryCode,
        region:       d.regionName,
        city:         d.cityName,
        latitude:     d.latitude,
        longitude:    d.longitude,
      }
    } catch {
      return {}
    }
  }
}

// ── Main export ─────────────────────────────────────────────

export async function collectVisitorData(consent: ConsentTypes): Promise<SessionData> {
  const ua     = navigator.userAgent
  const parsed = parseUserAgent(ua)
  const utms   = getUTMParams()

  // IP geolocation (only with analytics consent)
  let ipData: IPData = {}
  if (consent.analytics) {
    ipData = await getIPLocation()
  }

  // Connection info
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string }
    deviceMemory?: number
  }

  return {
    fingerprint: consent.analytics ? buildFingerprint() : undefined,

    // Location
    ip_address:   ipData.ip,
    country:      ipData.country_name,
    country_code: ipData.country_code,
    region:       ipData.region,
    city:         ipData.city,
    latitude:     ipData.latitude,
    longitude:    ipData.longitude,
    org:          ipData.org,

    // Device & Browser
    user_agent:      consent.analytics ? ua : undefined,
    browser:         parsed.browser,
    browser_version: parsed.browserVersion,
    os:              parsed.os,
    os_version:      parsed.osVersion,
    device_type:     parsed.deviceType,
    screen_resolution: consent.analytics
      ? `${screen.width}x${screen.height}`
      : undefined,
    viewport: consent.analytics
      ? `${window.innerWidth}x${window.innerHeight}`
      : undefined,
    color_depth:  consent.analytics ? screen.colorDepth : undefined,
    touch_support: consent.analytics ? navigator.maxTouchPoints > 0 : undefined,

    // Browser capabilities
    language:             navigator.language,
    timezone:             Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookies_enabled:      navigator.cookieEnabled,
    do_not_track:         navigator.doNotTrack === '1',
    hardware_concurrency: consent.analytics ? navigator.hardwareConcurrency : undefined,
    device_memory:        consent.analytics ? nav.deviceMemory : undefined,
    connection_type:      consent.analytics ? nav.connection?.effectiveType : undefined,

    // Traffic source
    referrer:     consent.marketing ? document.referrer || undefined : undefined,
    landing_page: consent.marketing ? window.location.pathname : undefined,
    ...(consent.marketing ? utms : {}),

    // Consent record
    consent_analytics: consent.analytics,
    consent_marketing: consent.marketing,
    consent_timestamp: new Date().toISOString(),
  }
}
