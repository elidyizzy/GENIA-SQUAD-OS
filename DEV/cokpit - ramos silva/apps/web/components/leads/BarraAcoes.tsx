'use client'

import { Button } from '@/components/ui/button'

interface Props {
  count: number
  onMoverPipeline: () => void
  onDescartar: () => void
  isLoading: boolean
}

export function BarraAcoes({ count, onMoverPipeline, onDescartar, isLoading }: Props) {
  if (count === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-zinc-900 text-white rounded-xl px-5 py-3 shadow-2xl shadow-zinc-900/30">
        <span className="text-sm font-medium text-zinc-300">
          {count} {count === 1 ? 'lead selecionado' : 'leads selecionados'}
        </span>
        <div className="w-px h-4 bg-zinc-700" />
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={onMoverPipeline}
          className="bg-transparent border-zinc-600 text-white hover:bg-zinc-800 hover:text-white"
        >
          Mover para Pipeline
        </Button>
        <Button
          size="sm"
          disabled={isLoading}
          onClick={onDescartar}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Descartar
        </Button>
      </div>
    </div>
  )
}
