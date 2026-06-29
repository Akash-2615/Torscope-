import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  /** Adds the subtle grid background. */
  grid?: boolean
  /** Constrain the section to one viewport and vertically center its content. */
  fit?: boolean
}

export function Section({ id, children, className, grid, fit }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full scroll-mt-24',
        fit ? 'flex min-h-[100svh] flex-col justify-center py-16 sm:py-20' : 'py-24 sm:py-32',
        className,
      )}
      aria-labelledby={`${id}-heading`}
    >
      {grid && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-fade-b"
        />
      )}
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  )
}
