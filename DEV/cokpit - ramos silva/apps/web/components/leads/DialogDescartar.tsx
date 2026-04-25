'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  count: number
  onClose: () => void
  onConfirm: (motivo: string) => void
  isLoading: boolean
}

export function DialogDescartar({ open, count, onClose, onConfirm, isLoading }: Props) {
  const [motivo, setMotivo] = useState('')

  const handleConfirm = () => {
    onConfirm(motivo)
    setMotivo('')
  }

  const handleClose = () => {
    if (!isLoading) {
      setMotivo('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Descartar {count} {count === 1 ? 'lead' : 'leads'}?</DialogTitle>
          <DialogDescription>
            Estes leads serão marcados como descartados. Você poderá localizá-los filtrando por status.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <label className="text-sm font-medium text-zinc-700 mb-1.5 block">
            Motivo (opcional)
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: Sem atividade, fora do perfil..."
            rows={3}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none"
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Descartando...' : 'Confirmar Descarte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
