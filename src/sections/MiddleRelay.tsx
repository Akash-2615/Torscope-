import { ShieldCheck, Repeat, DoorOpen, EyeOff } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { PacketFlow } from '@/components/viz/PacketFlow'
import type { FlowStep } from '@/components/viz/PacketFlow'
import { KnowsRow } from '@/components/viz/KnowsRow'

const STEPS: FlowStep[] = [
  { label: 'Guard Relay', sublabel: 'Germany', icon: <ShieldCheck className="h-5 w-5" />, color: '#34D399' },
  { label: 'Middle Relay', sublabel: 'Netherlands', icon: <Repeat className="h-5 w-5" />, color: '#A78BFA' },
  { label: 'Exit Relay', sublabel: 'United States', icon: <DoorOpen className="h-5 w-5" />, color: '#F87171' },
]

export function MiddleRelay() {
  return (
    <Section id="middle" grid>
      <SectionHeading
        align="left"
        eyebrow="Section 05 — Relay 2 of 3"
        title={
          <>
            The <span className="text-relay-middle">Middle</span> Relay
          </>
        }
        subtitle="The middle relay is the privacy buffer. It only ever talks to the Guard and the Exit — never to you or the destination — so it can't connect the two ends together."
      />

      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
        <Reveal direction="left" delay={0.05}>
          <div className="flex h-full flex-col gap-4">
            <GlowCard className="p-6">
              <h3 className="mb-1 flex items-center gap-2 text-lg font-bold">
                <EyeOff className="h-5 w-5 text-relay-middle" /> A relay that forwards blindly
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                The middle relay receives an encrypted blob from the Guard, peels exactly one layer of
                encryption, and forwards the still-encrypted result to the Exit. It learns the Guard's
                IP and the Exit's IP — but neither of those is you or the website.
              </p>
            </GlowCard>
            <GlowCard className="p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">What the Middle knows</h3>
              <div className="space-y-2">
                <KnowsRow label="Your real IP address" knows={false} />
                <KnowsRow label="The website you're visiting" knows={false} />
                <KnowsRow label="The previous & next relay" knows />
              </div>
            </GlowCard>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <GlowCard className="flex h-full flex-col justify-center p-8">
            <PacketFlow steps={STEPS} />
            <p className="mt-6 text-center text-xs text-ink-faint">
              The middle relay only sees relay-to-relay traffic. It cannot identify the{' '}
              <span className="text-ink">user</span> or the{' '}
              <span className="text-ink">website</span>.
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </Section>
  )
}
