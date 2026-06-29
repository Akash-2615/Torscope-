import { Laptop, Network, Server, Globe, MapPin, Wifi, Gauge, Eye } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { Magnify } from '@/components/primitives/Magnify'
import { PacketFlow } from '@/components/viz/PacketFlow'
import type { FlowStep } from '@/components/viz/PacketFlow'

const STEPS: FlowStep[] = [
  { label: 'Your Laptop', sublabel: '223.xxx.xxx.xxx', icon: <Laptop className="h-5 w-5" />, color: '#22d3ee', caption: 'Your real IP leaves your device' },
  { label: 'ISP', sublabel: 'Internet Service Provider', icon: <Network className="h-5 w-5" />, color: '#3b82f6', caption: 'Sees every site you request' },
  { label: 'DNS Resolver', sublabel: 'name → IP address', icon: <Server className="h-5 w-5" />, color: '#8b5cf6', caption: 'Translates the domain name' },
  { label: 'Website', sublabel: 'sees 223.xxx.xxx.xxx', icon: <Globe className="h-5 w-5" />, color: '#f87171', caption: 'Knows exactly who connected' },
]

const FACTS = [
  { icon: Eye, label: 'Real IP', value: '223.184.45.102', accent: '#f87171' },
  { icon: MapPin, label: 'Location', value: 'Mumbai, India', accent: '#22d3ee' },
  { icon: Wifi, label: 'ISP', value: 'Jio / Airtel', accent: '#3b82f6' },
  { icon: Gauge, label: 'Latency', value: '12 ms', accent: '#34d399' },
]

export function HowInternet() {
  return (
    <Section id="internet">
      <SectionHeading
        eyebrow="Section 02 — Baseline"
        title={
          <>
            How the <span className="text-gradient">Internet</span> Normally Works
          </>
        }
        subtitle="Before Tor, here's a normal request. Your real IP travels directly to every hop — and the website sees exactly where you are."
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="space-y-5">
            <GlowCard className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-relay-exit/15 text-relay-exit">
                  <Eye className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">What the website learns about you</p>
                  <p className="text-xs text-ink-faint">No anonymity — everything is exposed</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FACTS.map((f) => (
                  <Magnify key={f.label} className="p-4" scale={1.06}>
                    <div className="mb-1 flex items-center gap-2 text-xs text-ink-faint">
                      <f.icon className="h-3.5 w-3.5" style={{ color: f.accent }} />
                      {f.label}
                    </div>
                    <p className="font-mono text-sm font-medium text-ink">{f.value}</p>
                  </Magnify>
                ))}
              </div>
            </GlowCard>

            <div className="rounded-xl border border-relay-exit/20 bg-relay-exit/5 p-4 text-sm text-ink-muted">
              <strong className="text-relay-exit">The problem:</strong> every party in the path — your
              ISP, the DNS resolver and the destination — can link the request back to{' '}
              <span className="font-mono">you</span>. Tor is designed to break that link.
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <GlowCard className="p-6 sm:p-8">
            <p className="mb-6 text-center text-sm font-medium text-ink-muted">
              A single direct path — one packet, fully traceable
            </p>
            <PacketFlow steps={STEPS} />
          </GlowCard>
        </Reveal>
      </div>
    </Section>
  )
}
