import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, MousePointerClick, MapPin, Lock, ShieldCheck, Monitor } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { MagneticButton } from '@/components/primitives/MagneticButton'
import { CircuitGlobe } from '@/components/three/CircuitGlobe'
import { CircuitTimeline } from '@/components/viz/CircuitTimeline'
import { AnimatedIp } from '@/components/primitives/AnimatedIp'
import { useCircuit } from '@/hooks/useCircuit'
import { generateRelays } from '@/lib/relays'
import { buildCircuitPath } from '@/lib/circuit-path'
import { useSettings } from '@/context/SettingsContext'
import { useDestination } from '@/context/DestinationContext'
import { USER_COUNTRY } from '@/lib/constants'
import type { SiteDestination } from '@/lib/destinations'
import { BrandIcon } from '@/components/viz/BrandIcon'

function BrowserWindow({
  title,
  accent,
  destination,
  presetId,
  children,
}: {
  title: string
  accent: string
  destination: SiteDestination
  presetId?: string | null
  children: ReactNode
}) {
  return (
    <div className="liquid-glass glow-border overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <BrandIcon destination={destination} presetId={presetId} size={14} className="ml-1 shrink-0" />
        <span className="truncate text-[11px] font-medium" style={{ color: accent }}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-1.5">
        <Lock className="h-3 w-3 shrink-0 text-ink-faint" />
        <BrandIcon destination={destination} presetId={presetId} size={12} className="shrink-0 opacity-90" />
        <span className="truncate font-mono text-[10px] text-ink-faint">
          https://{destination.domain}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export function DemoMode() {
  const { circuit, regenerate, generation } = useCircuit()
  const { play } = useSettings()
  const { destination, presetId } = useDestination()
  const ambient = useMemo(() => generateRelays(120, 555), [])
  const pathSteps = useMemo(
    () => buildCircuitPath(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )

  const onNew = () => {
    play('transmit')
    regenerate()
  }

  return (
    <Section id="demo" grid fit>
      <SectionHeading
        compact
        eyebrow="Section 14 — Live Demo"
        title={
          <>
            Real <span className="text-gradient-accent">Demo Mode</span>
          </>
        }
        subtitle="Chrome leaks your real IP. Tor Browser shows an exit IP in another country — click New Identity to rebuild the circuit."
      />

      {/* Globe — full-width panel */}
      <Reveal flat className="mt-4">
        <GlowCard
          tilt={false}
          spotlight={false}
          className="relative h-[clamp(200px,34vh,420px)] w-full overflow-hidden p-0"
        >
          <CircuitGlobe circuit={circuit} destination={destination} ambient={ambient} />
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] text-ink-faint">
            <MousePointerClick className="h-3.5 w-3.5" /> Drag · scroll · fullscreen ↗
          </div>
        </GlowCard>
      </Reveal>

      {/* Chrome vs Tor — side-by-side comparison */}
      <Reveal direction="up" className="mt-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          <Monitor className="h-4 w-4 text-accent-cyan" />
          Side-by-side browser comparison
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <BrowserWindow title="Chrome — no Tor" accent="#f87171" destination={destination} presetId={presetId}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] text-ink-faint">Your public IP</p>
                <p className="truncate font-mono text-lg font-semibold text-relay-exit sm:text-xl">
                  223.184.45.102
                </p>
              </div>
              <span className="shrink-0 text-2xl" aria-hidden>
                🇮🇳
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-relay-exit" />
              Mumbai, India — fully exposed
            </div>
          </BrowserWindow>

          <BrowserWindow title="Tor Browser" accent="#a78bfa" destination={destination} presetId={presetId}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] text-ink-faint">Apparent (exit) IP</p>
                <AnimatedIp
                  ip={circuit.exit.ip}
                  className="truncate text-lg font-semibold text-accent-purple sm:text-xl"
                />
              </div>
              <motion.span
                key={circuit.exit.country.code}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="shrink-0 text-2xl"
                aria-hidden
              >
                {circuit.exit.country.flag}
              </motion.span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent-purple" />
              {circuit.exit.country.name} — anonymised
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1 text-[10px]">
              <CountryPill flag={circuit.guard.country.flag} name={circuit.guard.country.name} color="#34D399" />
              <span className="text-ink-faint">→</span>
              <CountryPill flag={circuit.middle.country.flag} name={circuit.middle.country.name} color="#A78BFA" />
              <span className="text-ink-faint">→</span>
              <CountryPill flag={circuit.exit.country.flag} name={circuit.exit.country.name} color="#F87171" />
            </div>
          </BrowserWindow>
        </div>
      </Reveal>

      {/* Control bar */}
      <Reveal direction="up" className="mt-4">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">
            Circuit <span className="font-mono text-ink">#{generation + 1}</span> — relay path below
          </p>
          <MagneticButton onClick={onNew} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            New Identity
          </MagneticButton>
        </div>
      </Reveal>

      {/* Timeline of the full path */}
      <Reveal direction="up" className="mt-4">
        <CircuitTimeline steps={pathSteps} generation={`${circuit.id}-${destination.country.code}-${destination.brand}`} compact />
      </Reveal>
    </Section>
  )
}

function CountryPill({ flag, name, color }: { flag: string; name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
      style={{ background: `${color}18`, color }}
    >
      <span aria-hidden>{flag}</span>
      {name}
    </span>
  )
}
