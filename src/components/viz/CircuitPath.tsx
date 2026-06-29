import { motion } from 'framer-motion'
import { Gauge, MapPin, Radio } from 'lucide-react'
import type { CircuitPathStep } from '@/lib/circuit-path'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'

interface CircuitPathProps {
  steps: CircuitPathStep[]
  className?: string
  title?: string
}

/** Vertical active-circuit list with country name on every hop. */
export function CircuitPath({ steps, className, title = 'Active Circuit' }: CircuitPathProps) {
  const { reducedMotion } = useSettings()
  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={reducedMotion ? undefined : { scale: 1.025, y: -2 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="metric-tile p-3.5"
          style={{ boxShadow: `0 0 20px -12px ${step.color}` }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold"
                  style={{ background: `${step.color}22`, color: step.color }}
                >
                  {step.relay
                    ? step.relay.role === 'guard'
                      ? 'G'
                      : step.relay.role === 'middle'
                        ? 'M'
                        : 'E'
                    : step.id === 'user'
                      ? '●'
                      : '◎'}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{step.title}</p>
                  {step.role && (
                    <p className="text-[11px] font-medium" style={{ color: step.color }}>
                      {step.role}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                <span aria-hidden>{step.country.flag}</span>
                <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: step.color }} />
                <span className="font-medium text-ink">{step.country.name}</span>
              </p>

              {step.ip && (
                <p className="mt-1 font-mono text-xs text-ink-faint">{step.ip}</p>
              )}
            </div>
          </div>

          {step.latencyMs != null && step.bandwidthMbps != null && (
            <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-ink-faint">
              <span className="flex items-center gap-1">
                <Gauge className="h-3 w-3" /> {step.latencyMs} ms
              </span>
              <span className="flex items-center gap-1">
                <Radio className="h-3 w-3" /> {step.bandwidthMbps} Mb/s
              </span>
            </div>
          )}

          {step.flags && step.flags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {step.flags.map((f) => (
                <span
                  key={f}
                  className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: `${step.color}40`, color: step.color }}
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
