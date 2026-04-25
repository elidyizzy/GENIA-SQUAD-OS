'use client'

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ClassificacaoBadge } from './ClassificacaoBadge'
import { StatusBadge } from './StatusBadge'
import { formatCNPJ, formatMoeda, formatData } from '@/lib/formatters'

interface Lead {
  id: string
  cnpj: string
  nome_empresa: string
  valor_divida: number
  uf: string | null
  classificacao: string
  status: string
  data_entrada: string
}

interface Props {
  data: Lead[]
  total: number
  page: number
  order: 'asc' | 'desc'
  onOrderToggle: () => void
  onPageChange: (page: number) => void
  isLoading: boolean
}

const LIMIT = 100

export function TabelaLeads({ data, total, page, order, onOrderToggle, onPageChange, isLoading }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-zinc-200 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead className="w-[280px]">Nome</TableHead>
              <TableHead className="w-[160px]">CNPJ</TableHead>
              <TableHead
                className="w-[160px] cursor-pointer select-none hover:text-zinc-900"
                onClick={onOrderToggle}
              >
                Valor Dívida {order === 'desc' ? '↓' : '↑'}
              </TableHead>
              <TableHead className="w-[60px]">UF</TableHead>
              <TableHead className="w-[80px]">Class.</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[110px]">Entrada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-zinc-400">
                  Nenhum lead encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              data.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-zinc-50">
                  <TableCell className="font-medium truncate max-w-[280px]" title={lead.nome_empresa}>
                    {lead.nome_empresa}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-zinc-600">
                    {formatCNPJ(lead.cnpj)}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900">
                    {formatMoeda(lead.valor_divida)}
                  </TableCell>
                  <TableCell className="text-zinc-600">{lead.uf ?? '—'}</TableCell>
                  <TableCell><ClassificacaoBadge value={lead.classificacao} /></TableCell>
                  <TableCell><StatusBadge value={lead.status} /></TableCell>
                  <TableCell className="text-sm text-zinc-500">{formatData(lead.data_entrada)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-zinc-500">
          {total === 0 ? 'Sem resultados' : `${total.toLocaleString('pt-BR')} leads — página ${page} de ${totalPages}`}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← Anterior
          </Button>
          <Button
            variant="outline" size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima →
          </Button>
        </div>
      </div>
    </div>
  )
}
