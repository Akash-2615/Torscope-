import {
  ShieldCheck,
  Newspaper,
  FlaskConical,
  Megaphone,
  Globe2,
  Lock,
  EyeOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'

interface Advantage {
  icon: LucideIcon
  title: string
  desc: string
  color: string
}

const ADVANTAGES: Advantage[] = [
  { icon: EyeOff, title: 'Privacy by default', desc: 'Browse without your IP, location and identity being trivially linked to your activity.', color: '#22d3ee' },
  { icon: Newspaper, title: 'Journalists', desc: 'Communicate with sources and publish safely, even under hostile network surveillance.', color: '#8b5cf6' },
  { icon: FlaskConical, title: 'Researchers', desc: 'Study sensitive topics and access information without revealing institutional identity.', color: '#3b82f6' },
  { icon: ShieldCheck, title: 'Whistleblowers', desc: 'Report wrongdoing through secure drop systems without exposing themselves.', color: '#34D399' },
  { icon: Megaphone, title: 'Activists', desc: 'Organise and speak freely in regions where dissent can be dangerous.', color: '#f472b6' },
  { icon: Globe2, title: 'Avoid censorship', desc: 'Reach the open internet from places where sites are blocked or filtered.', color: '#22d3ee' },
  { icon: Lock, title: 'Secure communication', desc: 'Layered encryption protects metadata, not just message content.', color: '#a78bfa' },
]

export function Advantages() {
  return (
    <Section id="advantages">
      <SectionHeading
        eyebrow="Section 12 — The Upside"
        title={
          <>
            Why Tor <span className="text-gradient">Matters</span>
          </>
        }
        subtitle="Anonymity is not about hiding wrongdoing — it's a foundation for privacy, press freedom and safety. Here's who benefits from Tor every day."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADVANTAGES.map((a, i) => (
          <Reveal key={a.title} delay={(i % 3) * 0.06} scale>
            <GlowCard className="h-full p-6">
              <span
                className="mb-4 grid h-12 w-12 place-items-center rounded-xl"
                style={{ background: `${a.color}18`, color: a.color }}
              >
                <a.icon className="h-5 w-5" />
              </span>
              <h3 className="mb-1.5 text-lg font-bold">{a.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{a.desc}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
