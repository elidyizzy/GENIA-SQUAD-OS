'use client'

import { useLeads, useLeadFilters } from '@/hooks/useLeads'
import { FiltrosLeads } from '@/components/leads/FiltrosLeads'
import { TabelaLeads } from '@/components/leads/TabelaLeads'

export function BancoLeadsContent() {
  const [filters, setFilters] = useLeadFilters()
  const { data, isLoading, isError } = useLeads(filters)

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
      />
    </div>
  )
}
