import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userEmail={user.email} />

      <div className="flex-1 min-w-0 lg:pl-0 pl-0">
        {/* Mobile top spacing for hamburger */}
        <div className="lg:hidden h-16" />
        {children}
      </div>
    </div>
  )
}
