import { Turtle, DoorOpen, Fingerprint, Bug, UserX, AlertTriangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'

interface Limitation {
  icon: LucideIcon
  title: string
  desc: string
}

const LIMITATIONS: Limitation[] = [
  { icon: Turtle, title: 'It is slower', desc: 'Three encrypted hops across the world add real latency. Streaming and large downloads feel sluggish.' },
  { icon: DoorOpen, title: 'Exit node visibility', desc: 'Without HTTPS, the exit relay can observe your unencrypted traffic. Always prefer encrypted sites.' },
  { icon: Fingerprint, title: 'Browser fingerprinting', desc: 'Plugins, screen size and behaviour can still identify you if you change the browser defaults.' },
  { icon: Bug, title: 'Malware risks', desc: 'Tor hides your IP, not malicious files. Downloads can still compromise your device.' },
  { icon: UserX, title: 'Logging into accounts', desc: 'Signing into a personal account (email, social) instantly links the session back to the real you.' },
  { icon: AlertTriangle, title: 'Not total anonymity', desc: 'Tor is a powerful tool, not a magic cloak. Operational mistakes can still expose you.' },
]

export function Limitations() {
  return (
    <Section id="limitations" grid>
      <SectionHeading
        eyebrow="Section 13 — Stay Honest"
        title={
          <>
            Limitations & <span className="text-relay-exit">Caveats</span>
          </>
        }
        subtitle="A responsible understanding of Tor includes its weaknesses. Anonymity depends on the network and on how carefully you use it."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LIMITATIONS.map((l, i) => (
          <Reveal key={l.title} delay={(i % 3) * 0.06}>
            <GlowCard className="h-full border-relay-exit/10 p-6" spotlight={false}>
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-relay-exit/12 text-relay-exit">
                <l.icon className="h-5 w-5" />
              </span>
              <h3 className="mb-1.5 text-lg font-bold">{l.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{l.desc}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-ink-muted">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p>
            <strong className="text-amber-300">Use responsibly.</strong> Tor exists to protect privacy
            and free expression. This platform is strictly educational and does not endorse or explain
            any illegal activity.
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
