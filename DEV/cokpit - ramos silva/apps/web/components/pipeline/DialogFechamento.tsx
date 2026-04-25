'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (resultado: 'ganho' | 'perdido', motivo: string) => void
  isLoading: boolean
}

export function DialogFechamento({ open, onClose, onConfirm, isLoading }: Props) {
  const [resultado, setResultado] = useState<'ganho' | 'perdido' | null>(null)
  const [motivo, setMotivo] = useState('')

  const handleClose = () => {
    if (!isLoading) {
      setResultado(null)
      setMotivo('')
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!resultado || !motivo.trim()) return
    onConfirm(resultado, motivo.trim())
    setResultado(null)
    setMotivo('')
  }

  const canConfirm = resultado !== null && motivo.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fechar lead</DialogTitle>
          <DialogDescription>
            Informe o resultado e motivo para registrar o fechamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm font-medium text-zinc-700 mb-2">Resultado *</p>
            <div className="flex gap-3">
              {(['ganho', 'perdido'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setResultado(r)}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                    resultado === r
                      ? r === 'ganho'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  {r === 'ganho' ? '✓ Ganho' : '✗ Perdido'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 mb-1.5 block">
              Motivo *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={resultado === 'ganho' ? 'Ex: Contrato assinado' : 'Ex: Sem interesse, orçamento indisponível...'}
              rows={3}
              disabled={isLoading}
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className={resultado === 'ganho' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}
          >
            {isLoading ? 'Salvando...' : 'Confirmar Fechamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
