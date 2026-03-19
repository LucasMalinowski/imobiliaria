import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliaria.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: imoveis } = await supabase
    .from('imoveis')
    .select('slug, updated_at')
    .eq('publicado', true)
    .order('updated_at', { ascending: false })

  const imoveisUrls: MetadataRoute.Sitemap = (imoveis || []).map((imovel) => ({
    url: `${siteUrl}/imoveis/${imovel.slug}`,
    lastModified: new Date(imovel.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/imoveis?finalidade=venda`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/imoveis?finalidade=aluguel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...imoveisUrls,
  ]
}
