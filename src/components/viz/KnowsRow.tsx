import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface KnowsRowProps {
  label: string
  knows: boolean
  className?: string
}

export function KnowsRow({ label, knows, className }: KnowsRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm',
        knows ? 'border-relay-exit/25 bg-relay-exit/5' : 'border-relay-guard/25 bg-relay-guard/5',
        className,
      )}
    >
      <span className="text-ink-muted">{label}</span>
      <span
        className={cn(
          'flex items-center gap-1.5 font-semibold',
          knows ? 'text-relay-exit' : 'text-relay-guard',
        )}
      >
        {knows ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        {knows ? 'Knows' : 'Hidden'}
      </span>
    </div>
  )
}
