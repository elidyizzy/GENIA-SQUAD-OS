'use client'

import { useState, useCallback } from 'react'
import {
  DndContext, DragEndEvent, DragOverlay,
  useSensor, useSensors, PointerSensor,
} from '@dnd-kit/core'
import { useQueryClient } from '@tanstack/react-query'
import { KanbanColumn } from './KanbanColumn'
import { LeadCard } from './LeadCard'
import { DialogFechamento } from './DialogFechamento'
import { ESTAGIOS, type GroupedPipeline, type PipelineLead } from '@/hooks/usePipeline'

interface Props {
  data: GroupedPipeline
  onCardClick: (lead: PipelineLead) => void
}

interface PendingDrop {
  pipelineLeadId: string
  fromStage: string
}

export function KanbanBoard({ data, onCardClick }: Props) {
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const findActiveLead = (): PipelineLead | null => {
    if (!activeId) return null
    for (const leads of Object.values(data)) {
      const found = leads.find((l) => l.id === activeId)
      if (found) return found
    }
    return null
  }

  const findLeadStage = (leadId: string): string | null => {
    for (const [stage, leads] of Object.entries(data)) {
      if (leads.some((l) => l.id === leadId)) return stage
    }
    return null
  }

  const moveOptimistic = useCallback((leadId: string, fromStage: string, toStage: string) => {
    const prev = queryClient.getQueryData<GroupedPipeline>(['pipeline'])
    if (!prev) return

    const next: GroupedPipeline = {}
    for (const [stage, leads] of Object.entries(prev)) {
      next[stage] = [...leads]
    }

    const idx = next[fromStage]?.findIndex((l) => l.id === leadId) ?? -1
    if (idx === -1) return

    const [card] = next[fromStage].splice(idx, 1)
    card.estagio = toStage
    next[toStage] = [...(next[toStage] ?? []), card]

    queryClient.setQueryData(['pipeline'], next)
    return prev
  }, [queryClient])

  const callMoveApi = async (
    pipelineLeadId: string,
    estagio: string,
    resultado?: string,
    motivo?: string
  ) => {
    const res = await fetch(`/api/pipeline/${pipelineLeadId}/estagio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estagio, resultado, motivo }),
    })
    if (!res.ok) throw new Error(await res.text())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return
    const leadId = active.id as string
    const toStage = over.id as string
    const fromStage = findLeadStage(leadId)

    if (!fromStage || fromStage === toStage) return

    if (toStage === 'fechado') {
      setPendingDrop({ pipelineLeadId: leadId, fromStage })
      return
    }

    const prev = moveOptimistic(leadId, fromStage, toStage)
    callMoveApi(leadId, toStage).catch(() => {
      if (prev) queryClient.setQueryData(['pipeline'], prev)
    }).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] })
    })
  }

  const handleFechamentoConfirm = async (resultado: 'ganho' | 'perdido', motivo: string) => {
    if (!pendingDrop) return
    setIsSaving(true)

    const { pipelineLeadId, fromStage } = pendingDrop
    const prev = moveOptimistic(pipelineLeadId, fromStage, 'fechado')

    try {
      await callMoveApi(pipelineLeadId, 'fechado', resultado, motivo)
    } catch {
      if (prev) queryClient.setQueryData(['pipeline'], prev)
    } finally {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] })
      setPendingDrop(null)
      setIsSaving(false)
    }
  }

  const activeLead = findActiveLead()

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex gap-4 overflow-x-auto pb-6">
          {ESTAGIOS.map(({ id, label }) => (
            <KanbanColumn
              key={id}
              id={id}
              label={label}
              leads={data[id] ?? []}
              onCardClick={onCardClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead && (
            <div className="w-[220px] rotate-2 shadow-2xl">
              <LeadCard lead={activeLead} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <DialogFechamento
        open={pendingDrop !== null}
        onClose={() => setPendingDrop(null)}
        onConfirm={handleFechamentoConfirm}
        isLoading={isSaving}
      />
    </>
  )
}
