'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { EnrichmentData } from '@/hooks/usePipelineLead'

interface Props {
  tipo: 'cadastral' | 'maps' | 'trf' | 'decisores'
  label: string
  icon: string
  enrichment: EnrichmentData | undefined
  pipelineLeadId: string
  onSuccess: () => void
}

interface CadastralData {
  qsa?: Array<{ nome_socio?: string; qualificacao_socio?: string }>
  situacao_cadastral?: string
  capital_social?: number | string
  cnae_fiscal?: string | number
  cnae_fiscal_descricao?: string
  endereco_completo?: string
}

interface MapsData {
  business_status?: string
  endereco?: string
  maps_url?: string
}

function CadastralDados({ d }: { d: CadastralData }) {
  const qsa = d.qsa ?? []
  const situacao = d.situacao_cadastral ?? ''
  const isAtiva = situacao.toUpperCase().includes('ATIVA')

  return (
    <div className="mt-2 space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div>
          <p className="text-xs text-zinc-400">Situação</p>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
            isAtiva ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            {situacao || '—'}
          </span>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Capital Social</p>
          <p className="text-zinc-700">
            {d.capital_social
              ? `R$ ${Number(d.capital_social).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : '—'}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-zinc-400">CNAE</p>
          <p className="text-zinc-700">{d.cnae_fiscal} — {d.cnae_fiscal_descricao || '—'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-zinc-400">Endereço</p>
          <p className="text-zinc-700">{d.endereco_completo || '—'}</p>
        </div>
      </div>
      {qsa.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 mb-1">Quadro Societário</p>
          <ul className="space-y-0.5">
            {qsa.map((s, i) => (
              <li key={i} className="text-xs text-zinc-600">
                <span className="font-medium">{s.nome_socio}</span>
                {s.qualificacao_socio && <span className="text-zinc-400"> — {s.qualificacao_socio}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MapsDados({ d }: { d: MapsData }) {
  const found = d.business_status !== undefined
  return (
    <div className="mt-2 space-y-1.5 text-sm">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          found ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
        }`}>
          {found ? 'Encontrado' : 'Não encontrado'}
        </span>
      </div>
      {d.endereco && (
        <p className="text-zinc-700 text-xs">{d.endereco}</p>
      )}
      {d.maps_url && (
        <a
          href={d.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          Ver no Google Maps →
        </a>
      )}
    </div>
  )
}

export function EnrichSection({ tipo, label, icon, enrichment, pipelineLeadId, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const canEnrich = tipo === 'cadastral' || tipo === 'maps'
  const status = enrichment?.status ?? 'pendente'
  const alreadyDone = status === 'sucesso'

  const doEnrich = async () => {
    setIsLoading(true)
    setConfirmOpen(false)
    try {
      await fetch(`/api/pipeline/${pipelineLeadId}/enrich/${tipo}`, { method: 'POST' })
      onSuccess()
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrichClick = () => {
    if (alreadyDone) {
      setConfirmOpen(true)
    } else {
      doEnrich()
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-medium text-zinc-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            status === 'sucesso' ? 'bg-green-100 text-green-700'
            : status === 'erro' ? 'bg-red-100 text-red-600'
            : 'bg-zinc-100 text-zinc-500'
          }`}>
            {status === 'sucesso' ? 'Feito' : status === 'erro' ? 'Erro' : 'Pendente'}
          </span>
          {canEnrich && !confirmOpen && (
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={handleEnrichClick}
              className="h-7 text-xs"
            >
              {isLoading ? 'Carregando...' : alreadyDone ? 'Atualizar' : 'Enriquecer'}
            </Button>
          )}
        </div>
      </div>

      {/* Re-enrichment confirmation */}
      {confirmOpen && (
        <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-xs text-amber-800">
          <span>Já enriquecido. Atualizar dados?</span>
          <button onClick={doEnrich} className="font-semibold underline">Sim</button>
          <button onClick={() => setConfirmOpen(false)} className="text-amber-600">Cancelar</button>
        </div>
      )}

      {status === 'erro' && enrichment?.erro && (
        <p className="mt-1.5 text-xs text-red-500">{enrichment.erro}</p>
      )}

      {status === 'sucesso' && enrichment?.dados && (
        <>
          {tipo === 'cadastral' && (
            <CadastralDados d={enrichment.dados as CadastralData} />
          )}
          {tipo === 'maps' && (
            <MapsDados d={enrichment.dados as MapsData} />
          )}
        </>
      )}

      {!canEnrich && status === 'pendente' && (
        <p className="mt-1.5 text-xs text-zinc-400 italic">
          Disponível em breve (Story 3.4)
        </p>
      )}
    </div>
  )
}
