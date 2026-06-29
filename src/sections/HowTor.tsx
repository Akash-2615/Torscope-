import { useMemo } from 'react'
import { Shuffle, MousePointerClick, Route } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { MagneticButton } from '@/components/primitives/MagneticButton'
import { CircuitGlobe } from '@/components/three/CircuitGlobe'
import { CircuitTimeline } from '@/components/viz/CircuitTimeline'
import { IpFlow } from '@/components/viz/IpFlow'
import { useCircuit } from '@/hooks/useCircuit'
import { generateRelays } from '@/lib/relays'
import { buildCircuitPath, buildIpFlow } from '@/lib/circuit-path'
import { useSettings } from '@/context/SettingsContext'
import { useDestination } from '@/context/DestinationContext'
import { USER_COUNTRY } from '@/lib/constants'

export function HowTor() {
  const { circuit, regenerate } = useCircuit()
  const { play, reducedMotion } = useSettings()
  const { destination, presetId } = useDestination()
  const ambient = useMemo(() => generateRelays(140, 21), [])
  const pathSteps = useMemo(
    () => buildCircuitPath(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )
  const ipFlow = useMemo(
    () => buildIpFlow(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )

  const onGenerate = () => {
    play('transmit')
    regenerate()
  }

  return (
    <Section id="how-tor" grid fit>
      <SectionHeading
        compact
        eyebrow="Section 03 — The Core Idea"
        title={
          <>
            How <span className="text-gradient-accent">Tor</span> Routes Your Traffic
          </>
        }
        subtitle="Your traffic hops through three volunteer relays — no single relay knows both who you are and where you're going."
      />

      {/* Globe — full-width panel sized to the viewport */}
      <Reveal flat className="mt-4">
        <GlowCard
          tilt={false}
          spotlight={false}
          className="relative h-[clamp(220px,38vh,480px)] w-full overflow-hidden p-0"
        >
          <CircuitGlobe circuit={circuit} destination={destination} ambient={ambient} />
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] text-ink-faint">
            <MousePointerClick className="h-3.5 w-3.5" /> Drag · scroll · fullscreen ↗
          </div>
        </GlowCard>
      </Reveal>

      {/* Control bar */}
      <Reveal direction="up" className="mt-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <Route className="h-4 w-4 text-accent-cyan" />
            Relay path — three hops across the world
          </div>
          <MagneticButton onClick={onGenerate} className="w-full sm:w-auto">
            <Shuffle className="h-4 w-4" />
            Generate Circuit
          </MagneticButton>
        </div>
      </Reveal>

      {/* Timeline of the full path */}
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
