'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export interface LeadFilters {
  page: number
  uf: string
  classificacao: string
  status: string
  q: string
  order: 'asc' | 'desc'
}

export function useLeads(filters: LeadFilters) {
  const params = new URLSearchParams()
  params.set('page', String(filters.page))
  if (filters.uf) params.set('uf', filters.uf)
  if (filters.classificacao) params.set('classificacao', filters.classificacao)
  if (filters.status) params.set('status', filters.status)
  if (filters.q) params.set('q', filters.q)
  params.set('order', filters.order)

  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const res = await fetch(`/api/leads?${params}`)
      if (!res.ok) throw new Error('Falha ao carregar leads')
      return res.json() as Promise<{ data: unknown[]; total: number; page: number }>
    },
    staleTime: 30_000,
  })
}

export function useLeadFilters(): [LeadFilters, (partial: Partial<LeadFilters>) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters: LeadFilters = {
    page: parseInt(searchParams.get('page') ?? '1'),
    uf: searchParams.get('uf') ?? '',
    classificacao: searchParams.get('classificacao') ?? '',
    status: searchParams.get('status') ?? '',
    q: searchParams.get('q') ?? '',
    order: (searchParams.get('order') as 'asc' | 'desc') ?? 'desc',
  }

  const setFilters = useCallback(
    (partial: Partial<LeadFilters>) => {
      const next = new URLSearchParams(searchParams.toString())
      Object.entries(partial).forEach(([k, v]) => {
        if (v === '' || v === undefined) next.delete(k)
        else next.set(k, String(v))
      })
      // reset page on filter change (not on page change itself)
      if (!('page' in partial)) next.set('page', '1')
      router.push(`${pathname}?${next}`)
    },
    [router, pathname, searchParams]
  )

  return [filters, setFilters]
}
