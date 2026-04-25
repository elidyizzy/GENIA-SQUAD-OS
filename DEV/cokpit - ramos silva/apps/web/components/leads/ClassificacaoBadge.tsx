import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const cores: Record<string, string> = {
  A: 'bg-red-100 text-red-700 border-red-200',
  B: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  C: 'bg-zinc-100 text-zinc-600 border-zinc-200',
}

export function ClassificacaoBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn('font-semibold', cores[value] ?? cores.C)}>
      {value}
    </Badge>
  )
}
