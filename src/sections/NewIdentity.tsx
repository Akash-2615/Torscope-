import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowRight, MousePointerClick } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { MagneticButton } from '@/components/primitives/MagneticButton'
import { CircuitGlobe } from '@/components/three/CircuitGlobe'
import { CircuitTimeline } from '@/components/viz/CircuitTimeline'
import { IpFlow } from '@/components/viz/IpFlow'
import { AnimatedIp } from '@/components/primitives/AnimatedIp'
import { useCircuit } from '@/hooks/useCircuit'
import { generateRelays } from '@/lib/relays'
import { buildCircuitPath, buildIpFlow } from '@/lib/circuit-path'
import { useSettings } from '@/context/SettingsContext'
import { useDestination } from '@/context/DestinationContext'
import { USER_COUNTRY } from '@/lib/constants'

export function NewIdentity() {
  const { circuit, previous, generation, regenerate } = useCircuit()
  const { play, reducedMotion } = useSettings()
  const { destination, presetId } = useDestination()
  const ambient = useMemo(() => generateRelays(120, 99), [])
  const pathSteps = useMemo(
    () => buildCircuitPath(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )
  const ipFlow = useMemo(
    () => buildIpFlow(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )

  const onNew = () => {
    play('success')
    regenerate()
  }

  return (
    <Section id="new-identity" grid fit>
      <SectionHeading
        compact
        eyebrow="Section 07 — Switch Identities"
        title={
          <>
            One Click, a <span className="text-gradient-accent">Whole New Identity</span>
          </>
        }
        subtitle="Tear down your circuit and build a brand new one on demand — new relays, new countries, new exit IP."
      />

      {/* Globe — full-width panel sized to the viewport */}
      <Reveal flat className="mt-4">
        <GlowCard
          tilt={false}
          spotlight={false}
          className="relative h-[clamp(200px,34vh,440px)] w-full overflow-hidden p-0"
        >
          <CircuitGlobe circuit={circuit} destination={destination} ambient={ambient} />
          <motion.div
            key={circuit.id}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 bg-accent-cyan/20"
          />
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] text-ink-faint">
            <MousePointerClick className="h-3.5 w-3.5" /> Drag · scroll · fullscreen ↗
          </div>
        </GlowCard>
      </Reveal>

      {/* Control row — rebuild button + exit IP change */}
      <Reveal direction="up" className="mt-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr]">
          <GlowCard className="flex flex-col justify-center gap-2.5 p-4">
            <MagneticButton onClick={onNew} className="w-full">
              <RefreshCw className="h-4 w-4" />
              Generate New Circuit
            </MagneticButton>
            <p className="text-center text-xs text-ink-faint">
              Circuits rebuilt this session: <span className="text-ink">{generation}</span>
            </p>
          </GlowCard>

          <GlowCard className="p-4" magnify={1.01}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="mb-1 text-[11px] text-ink-faint">Old exit IP</p>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                  <span className="font-mono text-sm text-ink-faint line-through">
                    {previous ? previous.exit.ip : '—.—.—.—'}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-accent-cyan" />
              <div className="flex-1">
                <p className="mb-1 text-[11px] text-ink-faint">New exit IP</p>
                <div className="glow-border rounded-lg bg-relay-exit/5 px-3 py-2">
                  <AnimatedIp ip={circuit.exit.ip} className="text-lg font-semibold text-relay-exit" />
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </Reveal>

      {/* Timeline of the new path */}
      <Reveal direction="up" className="mt-4">
        <CircuitTimeline steps={pathSteps} generation={`${circuit.id}-${destination.country.code}-${destination.brand}`} compact />
      </Reveal>

      {/* IP-transition flowchart — synced with the globe + fullscreen view */}
      <Reveal direction="up" className="mt-4">
        <GlowCard tilt={false} spotlight={false} className="p-4">
          <IpFlow
            steps={ipFlow}
            destination={destination}
            presetId={presetId}
            reducedMotion={reducedMotion}
            compact
          />
        </GlowCard>
      </Reveal>
    </Section>
  )
}
