import { motion } from 'framer-motion'
import { ArrowRight, EyeOff, ShieldCheck } from 'lucide-react'
import type { IpFlowStep } from '@/lib/circuit-path'
import type { SiteDestination } from '@/lib/destinations'
import { USER_REAL_IP } from '@/lib/circuit-path'
import { BrandIcon } from './BrandIcon'
import { cn } from '@/lib/cn'

interface IpFlowProps {
  steps: IpFlowStep[]
  destination: SiteDestination
  presetId?: string | null
  /** Tighter spacing/typography for fit-to-screen sections. */
  compact?: boolean
  reducedMotion?: boolean
  className?: string
}

/**
 * Synchronous flowchart of how the source IP is rewritten at every Tor hop.
 * Driven by the same circuit + destination as the globe, so it stays in sync
 * across the inline view and the fullscreen overlay.
 */
export function IpFlow({
  steps,
  destination,
  presetId = null,
  compact = false,
  reducedMotion = false,
  className,
}: IpFlowProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p
          className={cn(
            'flex items-center gap-1.5 font-semibold text-ink',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-accent-cyan" />
          Source IP rewritten at each hop
        </p>
        <p className="hidden items-center gap-1.5 text-[11px] text-ink-faint sm:flex">
          <EyeOff className="h-3 w-3" />
          Real IP <span className="font-mono text-accent-cyan">{USER_REAL_IP}</span> never leaves Tor
        </p>
      </div>

      <ol
        data-lenis-prevent
        className="flex items-stretch gap-1.5 overflow-x-auto pb-1"
      >
        {steps.map((step, i) => {
          const isSite = step.kind === 'site'
          const isLast = i === steps.length - 1
          return (
            <li key={step.id} className="flex items-stretch gap-1.5">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={cn(
                  'relative flex min-w-[7.5rem] flex-col justify-between rounded-xl border bg-base/70 backdrop-blur',
                  compact ? 'p-2' : 'p-2.5',
                )}
                style={{
                  borderColor: `${step.color}55`,
                  boxShadow: `0 0 0 1px ${step.color}18, 0 8px 24px -16px ${step.color}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  {isSite ? (
                    <BrandIcon destination={destination} presetId={presetId} size={14} className="shrink-0" />
                  ) : (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: step.color, boxShadow: `0 0 8px ${step.color}` }}
                    />
                  )}
                  <span className="truncate text-xs font-semibold text-ink">{step.label}</span>
                </div>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-faint">{step.role}</p>
                <p
                  className={cn(
                    'mt-1.5 font-mono tabular-nums text-ink',
                    compact ? 'text-[11px]' : 'text-xs',
                  )}
                  style={{ color: isSite ? '#f87171' : step.color }}
                >
                  {isSite ? `sees ${step.outIp}` : step.outIp}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-muted">
                  <span aria-hidden>{step.flag}</span>
                  <span className="truncate">{step.country}</span>
                </p>
              </motion.div>

              {!isLast && (
                <div className="flex flex-col items-center justify-center self-center">
                  <ArrowRight
                    className="h-4 w-4"
                    style={{ color: steps[i + 1].color }}
                  />
                  <span className="text-[8px] uppercase tracking-wide text-ink-faint">rewrite</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {!compact && (
        <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
          Each relay replaces the source IP with its own. By the time traffic reaches{' '}
          <span className="font-medium text-ink">{destination.brand}</span>, the only address visible
          is the Exit IP — your real IP <span className="font-mono text-accent-cyan">{USER_REAL_IP}</span>{' '}
          is stripped away after the Guard.
        </p>
      )}
    </div>
  )
}
