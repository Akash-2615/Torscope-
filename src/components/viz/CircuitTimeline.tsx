import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { Gauge, Radio, Laptop, Globe } from 'lucide-react'
import type { CircuitPathStep } from '@/lib/circuit-path'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'
import { BrandIcon } from '@/components/viz/BrandIcon'
import { SiteLink } from '@/components/viz/SiteLink'

interface CircuitTimelineProps {
  steps: CircuitPathStep[]
  /** Changes whenever the circuit rebuilds — re-triggers the entrance animation. */
  generation?: string | number
  /** Tighter spacing/typography so the timeline fits within a single viewport. */
  compact?: boolean
  className?: string
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Visualises the full path (You → Guard → Middle → Exit → Website) as a timeline.
 * Horizontal on large screens, a vertical rail on smaller screens. The connector
 * line "draws" itself and a packet travels along it whenever the circuit changes.
 */
export function CircuitTimeline({ steps, generation, compact, className }: CircuitTimelineProps) {
  const { reducedMotion } = useSettings()

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.13, delayChildren: 0.1 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 26, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
  }

  return (
    <div className={cn('relative', className)}>
      {/* ───────── Horizontal timeline (lg and up) ───────── */}
      <motion.div
        key={`h-${generation}`}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative hidden grid-cols-5 gap-4 lg:grid"
      >
        {/* connector line through the node centers (10% … 90%) */}
        <div
          className="pointer-events-none absolute inset-x-0 mx-[10%]"
          style={{ top: compact ? 20 : 26 }}
        >
          <div className="relative h-0.5">
            <motion.div
              key={`hline-${generation}`}
              initial={{ scaleX: reducedMotion ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.1, ease: EASE }}
              style={{ originX: 0 }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue opacity-70"
            />
            {!reducedMotion && (
              <motion.span
                key={`packet-${generation}`}
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2 }}
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{ boxShadow: '0 0 12px 2px rgba(255,255,255,0.9)' }}
              />
            )}
          </div>
        </div>

        {steps.map((step) => (
          <motion.div
            key={step.id}
            variants={item}
            className={cn('relative z-10 flex flex-col items-center', compact ? 'gap-2' : 'gap-3')}
          >
            <Node step={step} compact={compact} />
            <StepCard step={step} reducedMotion={reducedMotion} compact={compact} />
          </motion.div>
        ))}
      </motion.div>

      {/* ───────── Vertical timeline (below lg) ───────── */}
      <motion.ol
        key={`v-${generation}`}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative space-y-4 pl-14 lg:hidden"
      >
        <motion.div
          key={`vline-${generation}`}
          initial={{ scaleY: reducedMotion ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: reducedMotion ? 0 : 1.1, ease: EASE }}
          style={{ originY: 0 }}
          className="absolute bottom-6 left-[22px] top-6 w-0.5 origin-top rounded-full bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-blue opacity-70"
        />
        {steps.map((step) => (
          <motion.li key={step.id} variants={item} className="relative">
            <div className="absolute -left-[40px] top-4">
              <Node step={step} compact={compact} />
            </div>
            <StepCard step={step} reducedMotion={reducedMotion} compact={compact} />
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}

function Node({ step, compact }: { step: CircuitPathStep; compact?: boolean }) {
  const { reducedMotion } = useSettings()
  const size = compact ? 40 : 52
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-full border-2 bg-base"
      style={{
        width: size,
        height: size,
        borderColor: step.color,
        color: step.color,
        boxShadow: `0 0 18px -2px ${step.color}`,
      }}
    >
      {!reducedMotion && (
        <span
          className="absolute inset-0 animate-ping rounded-full opacity-40"
          style={{ background: step.color, animationDuration: '2.4s' }}
        />
      )}
      <span className="relative grid h-full w-full place-items-center rounded-full bg-base">
        <StepGlyph step={step} compact={compact} />
      </span>
    </span>
  )
}

function StepGlyph({ step, compact }: { step: CircuitPathStep; compact?: boolean }) {
  const icon = compact ? 'h-4 w-4' : 'h-5 w-5'
  if (step.id === 'user') return <Laptop className={icon} />
  if (step.id === 'site' && step.domain) {
    return (
      <BrandIcon
        destination={{ brand: step.title, domain: step.domain, country: step.country }}
        size={compact ? 22 : 26}
      />
    )
  }
  if (step.id === 'site') return <Globe className={icon} />
  const letter =
    step.relay?.role === 'guard' ? 'G' : step.relay?.role === 'middle' ? 'M' : 'E'
  return <span className={cn('font-bold', compact ? 'text-sm' : 'text-base')}>{letter}</span>
}

function StepCard({
  step,
  reducedMotion,
  compact,
}: {
  step: CircuitPathStep
  reducedMotion: boolean
  compact?: boolean
}) {
  const subtitle = step.role ?? (step.id === 'user' ? 'Your device' : 'Destination')
  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn('metric-tile w-full rounded-2xl', compact ? 'p-3' : 'p-4')}
      style={{ boxShadow: `0 0 26px -14px ${step.color}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2">
          {step.id === 'site' && step.domain && (
            <BrandIcon
              destination={{ brand: step.title, domain: step.domain, country: step.country }}
              size={compact ? 24 : 28}
              className="shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className={cn('truncate font-semibold text-ink', compact ? 'text-[13px]' : 'text-sm')}>
              {step.title}
            </p>
            <p className="truncate text-[11px] font-medium" style={{ color: step.color }}>
              {subtitle}
            </p>
          </div>
        </div>
        <span className={cn('shrink-0', compact ? 'text-lg' : 'text-xl')} aria-hidden>
          {step.country.flag}
        </span>
      </div>

      <p className={cn('font-medium text-ink', compact ? 'mt-2 text-[13px]' : 'mt-3 text-sm')}>
        {step.country.name}
      </p>
      {step.domain && step.id === 'site' && (
        <div className="mt-1.5">
          <SiteLink
            destination={{ brand: step.title, domain: step.domain, country: step.country }}
            compact
          />
        </div>
      )}
      {step.ip && <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{step.ip}</p>}

      {step.latencyMs != null && step.bandwidthMbps != null && (
        <div
          className={cn(
            'flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-faint',
            compact ? 'mt-2' : 'mt-3',
          )}
        >
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3" /> {step.latencyMs} ms
          </span>
          <span className="flex items-center gap-1">
            <Radio className="h-3 w-3" /> {step.bandwidthMbps} Mb/s
          </span>
        </div>
      )}

      {!compact && step.flags && step.flags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {step.flags.slice(0, 4).map((f) => (
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
  )
}
