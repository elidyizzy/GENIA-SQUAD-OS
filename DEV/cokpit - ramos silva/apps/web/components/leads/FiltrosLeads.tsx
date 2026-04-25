'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LeadFilters } from '@/hooks/useLeads'

const UFS = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA',
  'MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN',
  'RO','RR','RS','SC','SE','SP','TO',
]

interface Props {
  filters: LeadFilters
  onChange: (partial: Partial<LeadFilters>) => void
}

export function FiltrosLeads({ filters, onChange }: Props) {
  const [busca, setBusca] = useState(filters.q)

  // Debounce de 300ms na busca
  useEffect(() => {
    const t = setTimeout(() => {
      if (busca !== filters.q) onChange({ q: busca })
    }, 300)
    return () => clearTimeout(t)
  }, [busca, filters.q, onChange])

  const limpar = () => {
    setBusca('')
    onChange({ uf: '', classificacao: '', status: '', q: '', page: 1 })
  }

  const temFiltro = filters.uf || filters.classificacao || filters.status || filters.q

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Buscar por nome ou CNPJ..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-64"
      />

      <Select value={filters.uf || 'todos'} onValueChange={(v) => onChange({ uf: (v ?? '') === 'todos' ? '' : (v ?? '') })}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="UF" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas UFs</SelectItem>
          {UFS.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.classificacao || 'todos'} onValueChange={(v) => onChange({ classificacao: (v ?? '') === 'todos' ? '' : (v ?? '') })}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Classificação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          <SelectItem value="A">A — Alta (≥R$3M)</SelectItem>
          <SelectItem value="B">B — Média (≥R$1M)</SelectItem>
          <SelectItem value="C">C — Baixa</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status || 'todos'} onValueChange={(v) => onChange({ status: (v ?? '') === 'todos' ? '' : (v ?? '') })}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="novo">Novo</SelectItem>
          <SelectItem value="pipeline">No pipeline</SelectItem>
          <SelectItem value="descartado">Descartado</SelectItem>
        </SelectContent>
      </Select>

      {temFiltro && (
        <Button variant="ghost" size="sm" onClick={limpar} className="text-zinc-500">
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
