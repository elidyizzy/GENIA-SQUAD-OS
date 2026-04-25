'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLeads, useLeadFilters } from '@/hooks/useLeads'
import { FiltrosLeads } from '@/components/leads/FiltrosLeads'
import { TabelaLeads } from '@/components/leads/TabelaLeads'
import { BarraAcoes } from '@/components/leads/BarraAcoes'
import { DialogDescartar } from '@/components/leads/DialogDescartar'

interface ToastMsg { id: number; message: string; type: 'success' | 'error' }

export function BancoLeadsContent() {
  const [filters, setFilters] = useLeadFilters()
  const { data, isLoading, isError } = useLeads(filters)
  const queryClient = useQueryClient()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isActing, setIsActing] = useState(false)
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const toastCounter = useRef(0)

  // Clear selection on page change
  const prevPage = useRef(filters.page)
  useEffect(() => {
    if (filters.page !== prevPage.current) {
      setSelectedIds(new Set())
      prevPage.current = filters.page
    }
  }, [filters.page])

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastCounter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const handleMoverPipeline = async () => {
    setIsActing(true)
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/leads/${id}/pipeline`, { method: 'POST' }).then((r) =>
          r.ok ? r.json() : Promise.reject(r.status)
        )
      )
    )
    const ok = results.filter((r) => r.status === 'fulfilled').length
    const fail = results.filter((r) => r.status === 'rejected').length
    await queryClient.invalidateQueries({ queryKey: ['leads'] })
    setSelectedIds(new Set())
    setIsActing(false)
    if (ok > 0) addToast(`${ok} lead${ok > 1 ? 's' : ''} movido${ok > 1 ? 's' : ''} para o pipeline`)
    if (fail > 0) addToast(`${fail} lead${fail > 1 ? 's' : ''} não pôde ser movido (já no pipeline ou descartado)`, 'error')
  }

  const handleDescartar = async (motivo: string) => {
    setIsActing(true)
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/leads/${id}/descartar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ motivo }),
        }).then((r) => r.ok ? r.json() : Promise.reject(r.status))
      )
    )
    const ok = results.filter((r) => r.status === 'fulfilled').length
    const fail = results.filter((r) => r.status === 'rejected').length
    await queryClient.invalidateQueries({ queryKey: ['leads'] })
    setSelectedIds(new Set())
    setDialogOpen(false)
    setIsActing(false)
    if (ok > 0) addToast(`${ok} lead${ok > 1 ? 's' : ''} descartado${ok > 1 ? 's' : ''}`)
    if (fail > 0) addToast(`${fail} lead${fail > 1 ? 's' : ''} não pôde ser descartado (está no pipeline)`, 'error')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Banco de Leads</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Empresas com dívida PGFN ≥ R$1.000.000 — atualizado semanalmente.
        </p>
      </div>

      <FiltrosLeads filters={filters} onChange={setFilters} />

      {isError && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Falha ao carregar leads. Verifique a conexão com o banco de dados.
        </div>
      )}

      <TabelaLeads
        data={(data?.data ?? []) as never}
        total={data?.total ?? 0}
        page={filters.page}
        order={filters.order}
        onOrderToggle={() => setFilters({ order: filters.order === 'desc' ? 'asc' : 'desc' })}
        onPageChange={(page) => setFilters({ page })}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <BarraAcoes
        count={selectedIds.size}
        onMoverPipeline={handleMoverPipeline}
        onDescartar={() => setDialogOpen(true)}
        isLoading={isActing}
      />

      <DialogDescartar
        open={dialogOpen}
        count={selectedIds.size}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDescartar}
        isLoading={isActing}
      />

      {/* Toasts */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg text-white animate-in slide-in-from-right-4 fade-in-0 ${
              t.type === 'error' ? 'bg-red-600' : 'bg-zinc-900'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
