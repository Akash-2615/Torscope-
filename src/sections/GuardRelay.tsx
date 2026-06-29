import { Laptop, ShieldCheck, Lock, Fingerprint } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { PacketFlow } from '@/components/viz/PacketFlow'
import type { FlowStep } from '@/components/viz/PacketFlow'
import { KnowsRow } from '@/components/viz/KnowsRow'

const STEPS: FlowStep[] = [
  { label: 'Your Laptop', sublabel: '223.184.45.102', icon: <Laptop className="h-5 w-5" />, color: '#22d3ee' },
  { label: 'Guard Relay', sublabel: 'Entry point — Germany', icon: <ShieldCheck className="h-5 w-5" />, color: '#34D399' },
]

export function GuardRelay() {
  return (
    <Section id="guard">
      <SectionHeading
        align="left"
        eyebrow="Section 04 — Relay 1 of 3"
        title={
          <>
            The <span className="text-relay-guard">Entry / Guard</span> Relay
          </>
        }
        subtitle="The first hop in every circuit. It's the only relay that sees your real IP address — but it has no idea which website you ultimately want to reach."
      />

      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
        <Reveal direction="right">
          <GlowCard className="flex h-full flex-col justify-center p-8">
            <PacketFlow steps={STEPS} seg={1} />
            <div className="mx-auto mt-6 w-full max-w-md rounded-xl border border-relay-guard/25 bg-relay-guard/5 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-relay-guard">
                <Lock className="h-4 w-4" /> The Guard stores / sees:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-ink-muted">
                  <Fingerprint className="h-4 w-4 text-relay-exit" />
                  Your real IP address <span className="font-mono text-ink">223.184.45.102</span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Lock className="h-4 w-4 text-relay-guard" />
                  An <span className="text-ink">encrypted packet</span> it cannot read
                </div>
              </div>
            </div>
          </GlowCard>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div className="flex h-full flex-col gap-4">
            <GlowCard className="p-6">
              <h3 className="mb-1 text-lg font-bold">Why it's called a "Guard"</h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                Tor reuses the same entry guard for a while (weeks) rather than picking a new one each
                time. This protects you from an attacker who might otherwise eventually become your
                entry node by chance and try to deanonymize you.
              </p>
            </GlowCard>

            <GlowCard className="p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">What the Guard knows</h3>
              <div className="space-y-2">
                <KnowsRow label="Your real IP address" knows />
                <KnowsRow label="The website you're visiting" knows={false} />
                <KnowsRow label="The packet contents" knows={false} />
              </div>
            </GlowCard>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
