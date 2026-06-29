import { Laptop, ShieldCheck, Repeat, DoorOpen, Globe, ArrowUp, Layers, KeyRound, EyeOff } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { MagneticButton } from '@/components/primitives/MagneticButton'
import { PacketFlow } from '@/components/viz/PacketFlow'
import type { FlowStep } from '@/components/viz/PacketFlow'
import { useSettings } from '@/context/SettingsContext'

const STEPS: FlowStep[] = [
  { label: 'Your Laptop', sublabel: 'Real IP, fully encrypted', icon: <Laptop className="h-5 w-5" />, color: '#22d3ee' },
  { label: 'Guard Relay', sublabel: 'Knows you, not the site', icon: <ShieldCheck className="h-5 w-5" />, color: '#34D399' },
  { label: 'Middle Relay', sublabel: 'Knows neither end', icon: <Repeat className="h-5 w-5" />, color: '#A78BFA' },
  { label: 'Exit Relay', sublabel: 'Knows the site, not you', icon: <DoorOpen className="h-5 w-5" />, color: '#F87171' },
  { label: 'Website', sublabel: 'Sees the exit IP only', icon: <Globe className="h-5 w-5" />, color: '#60a5fa' },
]

const TAKEAWAYS = [
  { icon: Layers, title: 'Three relays', desc: 'Every circuit uses a Guard, a Middle and an Exit — chosen across different parts of the world.', color: '#22d3ee' },
  { icon: KeyRound, title: 'Layered encryption', desc: 'Each relay peels one layer. No relay can read the full path or the data inside.', color: '#a78bfa' },
  { icon: EyeOff, title: 'No single point knows all', desc: 'Privacy comes from splitting knowledge — identity and destination never meet.', color: '#34d399' },
]

export function Summary() {
  const { reducedMotion } = useSettings()
  return (
    <Section id="summary" grid>
      <SectionHeading
        eyebrow="Section 15 — Recap"
        title={
          <>
            The Whole Journey, <span className="text-gradient">One Glance</span>
          </>
        }
        subtitle="From your laptop to the website, here's how a single Tor request stays private at every hop."
      />

      <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
        <Reveal scale>
          <GlowCard className="p-8">
            <PacketFlow steps={STEPS} seg={0.7} />
          </GlowCard>
        </Reveal>

        <div className="flex flex-col gap-4">
          {TAKEAWAYS.map((t, i) => (
            <Reveal key={t.title} direction="left" delay={i * 0.08}>
              <GlowCard className="flex items-center gap-4 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: `${t.color}18`, color: t.color }}>
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{t.title}</h3>
                  <p className="text-sm text-ink-muted">{t.desc}</p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-14">
        <div className="glow-border relative overflow-hidden rounded-3xl bg-surface/60 p-10 text-center backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
          <h3 className="relative text-2xl font-bold sm:text-3xl">
            You now understand <span className="text-gradient">how Tor works.</span>
          </h3>
          <p className="relative mx-auto mt-3 max-w-xl text-ink-muted">
            Anonymity is a tool for privacy, journalism and free expression — built on elegant
            engineering, not magic. Keep exploring, and use it responsibly.
          </p>
          <div className="relative mt-7 flex justify-center">
            <MagneticButton
              onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
            >
              <ArrowUp className="h-4 w-4" /> Back to top
            </MagneticButton>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
