import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const config: Record<string, { label: string; cls: string }> = {
  novo: { label: 'Novo', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  pipeline: { label: 'No pipeline', cls: 'bg-green-100 text-green-700 border-green-200' },
  descartado: { label: 'Descartado', cls: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
}

export function StatusBadge({ value }: { value: string }) {
  const c = config[value] ?? config.novo
  return (
    <Badge variant="outline" className={cn('text-xs', c.cls)}>
      {c.label}
    </Badge>
  )
}
