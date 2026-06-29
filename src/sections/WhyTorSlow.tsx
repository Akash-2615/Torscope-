import { scaleLinear } from 'd3'
import { motion } from 'framer-motion'
import { Laptop, Globe, ShieldCheck, Repeat, DoorOpen, Gauge, Zap } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { useSettings } from '@/context/SettingsContext'

const LATENCY = [
  { label: 'Direct (Chrome)', hops: 1, ms: 28, color: '#34D399' },
  { label: 'Tor (3 relays)', hops: 3, ms: 240, color: '#A78BFA' },
]

const scale = scaleLinear().domain([0, 260]).range([0, 100])

function MiniHop({ icon: Icon, color }: { icon: typeof Laptop; color: string }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5" style={{ color }}>
      <Icon className="h-4 w-4" />
    </span>
  )
}

function Connector({ delay, active }: { delay: number; active: boolean }) {
  const { reducedMotion } = useSettings()
  return (
    <div className="relative mx-1 h-px flex-1 bg-white/10">
      {active && !reducedMotion && (
        <motion.span
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-cyan shadow-glow-cyan"
          animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, delay, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )
}

export function WhyTorSlow() {
  return (
    <Section id="why-slow" grid>
      <SectionHeading
        eyebrow="Section 11 — The Trade-off"
        title={
          <>
            Why Tor Feels <span className="text-gradient">Slower</span>
          </>
        }
        subtitle="Anonymity has a cost: every request bounces through three relays across the planet, with encryption at each hop. More distance and more cryptography means more latency."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal direction="right">
          <GlowCard className="flex h-full flex-col gap-6 p-7">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-relay-guard">
                <Zap className="h-4 w-4" /> Direct connection — 1 hop
              </p>
              <div className="flex items-center">
                <MiniHop icon={Laptop} color="#22d3ee" />
                <Connector delay={0} active />
                <MiniHop icon={Globe} color="#60a5fa" />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-relay-middle">
                <ShieldCheck className="h-4 w-4" /> Through Tor — 3 hops
              </p>
              <div className="flex items-center">
                <MiniHop icon={Laptop} color="#22d3ee" />
                <Connector delay={0} active />
                <MiniHop icon={ShieldCheck} color="#34D399" />
                <Connector delay={0.35} active />
                <MiniHop icon={Repeat} color="#A78BFA" />
                <Connector delay={0.7} active />
                <MiniHop icon={DoorOpen} color="#F87171" />
                <Connector delay={1.05} active />
                <MiniHop icon={Globe} color="#60a5fa" />
              </div>
            </div>
          </GlowCard>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <GlowCard className="flex h-full flex-col p-7">
            <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-ink">
              <Gauge className="h-4 w-4 text-accent-cyan" /> Typical round-trip latency
            </p>
            <div className="flex flex-1 flex-col justify-center gap-7">
              {LATENCY.map((d, i) => (
                <div key={d.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">{d.label}</span>
                    <span className="font-mono font-semibold" style={{ color: d.color }}>
                      {d.ms} ms
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${scale(d.ms)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-faint">
              Numbers are illustrative. Real latency depends on which relays are chosen and how far
              apart they are — exactly why circuits matter.
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </Section>
  )
}
