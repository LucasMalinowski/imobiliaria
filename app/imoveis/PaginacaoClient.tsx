'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Pagination } from '@/components/ui/Pagination'

interface PaginacaoClientProps {
  currentPage: number
  totalPages: number
}

export default function PaginacaoClient({ currentPage, totalPages }: PaginacaoClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}
