import Link from 'next/link'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Imobiliária Premium'
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">{siteName}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Especialistas em compra, venda e aluguel de imóveis. Encontre o imóvel
              dos seus sonhos com segurança e confiança.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Navegação</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Início' },
                { href: '/imoveis', label: 'Todos os Imóveis' },
                { href: '/imoveis?finalidade=venda', label: 'Imóveis à Venda' },
                { href: '/imoveis?finalidade=aluguel', label: 'Imóveis para Aluguel' },
                { href: '/imoveis?tipo=apartamento', label: 'Apartamentos' },
                { href: '/imoveis?tipo=casa', label: 'Casas' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent-400 transition-colors text-sm group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-accent-400 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Tipos de Imóvel</h3>
            <ul className="space-y-3">
              {[
                { href: '/imoveis?tipo=casa', label: 'Casas' },
                { href: '/imoveis?tipo=apartamento', label: 'Apartamentos' },
                { href: '/imoveis?tipo=terreno', label: 'Terrenos' },
                { href: '/imoveis?tipo=comercial', label: 'Comercial' },
                { href: '/imoveis?tipo=rural', label: 'Rural' },
                { href: '/imoveis?tipo=cobertura', label: 'Coberturas' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent-400 transition-colors text-sm group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-accent-400 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-green-400 transition-colors group"
                >
                  <MessageCircle className="w-5 h-5 mt-0.5 shrink-0 group-hover:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp</p>
                    <p className="text-sm">(11) 99999-9999</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@imobiliaria.com.br"
                  className="flex items-start gap-3 text-gray-400 hover:text-accent-400 transition-colors group"
                >
                  <Mail className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">E-mail</p>
                    <p className="text-sm">contato@imobiliaria.com.br</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Endereço</p>
                  <p className="text-sm">Rua das Flores, 123<br />São Paulo, SP</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>
              © {currentYear} {siteName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacidade" className="hover:text-gray-300 transition-colors">
                Política de Privacidade
              </Link>
              <span>·</span>
              <Link href="/termos" className="hover:text-gray-300 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center sm:text-left">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            Seus dados são tratados com segurança e confidencialidade.{' '}
            <Link
              href="/admin/login"
              className="text-gray-700 opacity-20 hover:opacity-50 transition-opacity"
              title="Acesso restrito"
            >
              ·
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
