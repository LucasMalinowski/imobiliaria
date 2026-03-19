'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Imobiliária Premium'

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral',
  },
  {
    href: '/admin/imoveis',
    label: 'Imóveis',
    icon: Building2,
    description: 'Gerenciar imóveis',
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: Users,
    description: 'Mensagens recebidas',
  },
  {
    href: '/admin/configuracoes',
    label: 'Configurações',
    icon: Settings,
    description: 'Configurar sistema',
  },
]

interface AdminSidebarProps {
  userEmail?: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{siteName}</p>
            <p className="text-white/40 text-xs mt-0.5">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActive ? 'text-accent-400' : 'text-white/50 group-hover:text-white/80'
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-none">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5 leading-none">
                  {item.description}
                </p>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-accent-400 shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10">
        {userEmail && (
          <div className="px-4 py-2 mb-2">
            <p className="text-white/40 text-xs">Conectado como</p>
            <p className="text-white/80 text-sm font-medium truncate">{userEmail}</p>
          </div>
        )}

        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sair</span>
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-primary-500 text-white rounded-lg flex items-center justify-center shadow-lg"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-primary-700 z-50 lg:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {SidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-700 min-h-screen shrink-0">
        {SidebarContent}
      </aside>
    </>
  )
}
