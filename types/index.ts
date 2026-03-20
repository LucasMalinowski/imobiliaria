export type Finalidade = 'venda' | 'aluguel'

export type TipoImovel =
  | 'casa'
  | 'apartamento'
  | 'terreno'
  | 'comercial'
  | 'rural'
  | 'cobertura'
  | 'studio'
  | 'sobrado'
  | 'chacara'
  | 'galpao'

export type StatusImovel = 'disponivel' | 'vendido' | 'alugado' | 'reservado'

export interface ImovelImagem {
  id: string
  imovel_id: string
  url: string
  storage_path: string
  ordem: number
  principal: boolean
  created_at?: string
}

export interface Imovel {
  id: string
  slug: string
  titulo: string
  descricao?: string
  preco: number
  finalidade: Finalidade
  tipo: TipoImovel
  status: StatusImovel
  destaque: boolean
  endereco?: string
  cidade?: string
  bairro?: string
  cep?: string
  quartos: number
  banheiros: number
  vagas: number
  area_total?: number
  area_construida?: number
  observacoes_internas?: string
  publicado: boolean
  created_at: string
  updated_at: string
  imagens?: ImovelImagem[]
}

export interface VisitorSession {
  id: string
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
  consent_analytics?: boolean
  consent_marketing?: boolean
  consent_timestamp?: string
  created_at: string
}

export interface Lead {
  id: string
  imovel_id?: string
  imovel_titulo?: string
  nome: string
  email?: string
  telefone?: string
  mensagem?: string
  lido: boolean
  session_id?: string
  session?: VisitorSession
  created_at: string
}

export interface Configuracao {
  id: string
  chave: string
  valor?: string
  updated_at?: string
}

export interface FiltrosImovel {
  finalidade?: Finalidade
  tipo?: TipoImovel
  cidade?: string
  bairro?: string
  preco_min?: number
  preco_max?: number
  quartos?: number
  status?: StatusImovel
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ActionResult<T = null> {
  success: boolean
  data?: T
  error?: string
}
