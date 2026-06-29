import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  className?: string
  /** Tighter spacing/typography for viewport-fit sections. */
  compact?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  compact,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        compact ? 'gap-2' : 'gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="chip border-accent-purple/30 bg-accent-purple/10 text-accent-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-glow-cyan" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            'max-w-3xl text-balance font-bold leading-tight tracking-tight',
            compact ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              'max-w-2xl text-pretty leading-relaxed text-ink-muted',
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg',
              align === 'center' && 'mx-auto',
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  )
}
