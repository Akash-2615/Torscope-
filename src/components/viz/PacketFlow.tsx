import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'

export interface FlowStep {
  label: string
  sublabel?: string
  icon?: ReactNode
  color?: string
  caption?: string
}

interface PacketFlowProps {
  steps: FlowStep[]
  className?: string
  /** seconds per hop */
  seg?: number
}

/** Vertical animated flow: a single glowing packet travels down through each hop. */
export function PacketFlow({ steps, className, seg = 0.8 }: PacketFlowProps) {
  const { reducedMotion } = useSettings()
  const connectors = steps.length - 1
  const cycle = connectors * seg

  return (
    <div className={cn('mx-auto flex w-full max-w-md flex-col', className)}>
      {steps.map((step, i) => (
        <div key={`${step.label}-${i}`} className="flex flex-col items-stretch">
          <div
            className="glass flex items-center gap-4 rounded-2xl px-5 py-4"
            style={{ boxShadow: step.color ? `0 0 24px -10px ${step.color}` : undefined }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5"
              style={{ color: step.color ?? '#22d3ee' }}
            >
              {step.icon}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{step.label}</p>
              {step.sublabel && (
                <p className="truncate font-mono text-xs text-ink-muted">{step.sublabel}</p>
              )}
              {step.caption && <p className="mt-0.5 text-xs text-ink-faint">{step.caption}</p>}
            </div>
          </div>

          {i < connectors && (
            <div className="relative mx-auto my-1 h-9 w-px bg-gradient-to-b from-white/20 to-white/5">
              {!reducedMotion && (
                <motion.span
                  className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-cyan shadow-glow-cyan"
                  style={{ top: 0 }}
                  animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] }}
                  transition={{
                    duration: seg,
                    delay: i * seg,
                    repeat: Infinity,
                    repeatDelay: cycle - seg,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
