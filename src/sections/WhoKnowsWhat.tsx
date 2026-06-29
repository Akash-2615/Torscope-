import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Minus, Laptop, ShieldCheck, Repeat, DoorOpen, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'
import { useDestination } from '@/context/DestinationContext'

type Knowledge = 'yes' | 'no' | 'partial'

interface Party {
  id: string
  name: string
  icon: LucideIcon
  color: string
  identity: Knowledge
  destination: Knowledge
  content: Knowledge
  note: string
}

const COLUMNS = ['Your identity (IP)', 'Destination site', 'Traffic content'] as const

const PARTIES_BASE: Party[] = [
  {
    id: 'you', name: 'You', icon: Laptop, color: '#22d3ee',
    identity: 'yes', destination: 'yes', content: 'yes',
    note: 'You know everything — your own identity, where you are going, and what you are sending.',
  },
  {
    id: 'guard', name: 'Guard', icon: ShieldCheck, color: '#34D399',
    identity: 'yes', destination: 'no', content: 'no',
    note: 'The Guard sees your real IP but only forwards encrypted data to the Middle. It has no idea of the destination.',
  },
  {
    id: 'middle', name: 'Middle', icon: Repeat, color: '#A78BFA',
    identity: 'no', destination: 'no', content: 'no',
    note: 'The Middle relay is fully blind — it only knows the Guard and the Exit. It cannot link you to anything.',
  },
  {
    id: 'exit', name: 'Exit', icon: DoorOpen, color: '#F87171',
    identity: 'no', destination: 'yes', content: 'partial',
    note: 'The Exit sees the destination and, if you are not using HTTPS, the content too — but never your real IP.',
  },
  {
    id: 'site', name: 'Website', icon: Globe, color: '#60a5fa',
    identity: 'no', destination: 'yes', content: 'yes',
    note: 'The website sees the Exit relay\'s IP instead of yours. It knows its own address and the content you send to it.',
  },
]

function buildParties(brand: string): Party[] {
  return PARTIES_BASE.map((p) =>
    p.id === 'site'
      ? { ...p, name: brand, note: `${brand} sees the Exit relay's IP instead of yours.` }
      : p,
  )
}

const ICONS: Record<Knowledge, { icon: LucideIcon; color: string; label: string }> = {
  yes: { icon: Check, color: '#F87171', label: 'Knows' },
  no: { icon: X, color: '#34D399', label: 'Hidden' },
  partial: { icon: Minus, color: '#fbbf24', label: 'Only without HTTPS' },
}

export function WhoKnowsWhat() {
  const [active, setActive] = useState<string>('guard')
  const { play } = useSettings()
  const { destination } = useDestination()
  const parties = useMemo(() => buildParties(destination.brand), [destination.brand])
  const activeParty = parties.find((p) => p.id === active)!

  return (
    <Section id="who-knows">
      <SectionHeading
        eyebrow="Section 10 — The Trust Model"
        title={
          <>
            Who Knows <span className="text-gradient">What?</span>
          </>
        }
        subtitle="Tor's guarantee is that no single party can connect your identity to your destination. Tap a row to see exactly what each participant can — and cannot — learn."
      />

      <Reveal scale className="mt-12">
        <GlowCard className="overflow-hidden p-0" spotlight={false}>
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-px bg-white/5 text-sm">
            <div className="bg-surface p-4 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Participant
            </div>
            {COLUMNS.map((c) => (
              <div key={c} className="bg-surface p-4 text-center text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {c}
              </div>
            ))}

            {parties.map((p) => (
              <Row key={p.id} party={p} active={active === p.id} onSelect={() => { play('click'); setActive(p.id) }} />
            ))}
          </div>
        </GlowCard>
      </Reveal>

      <Reveal className="mt-5">
        <motion.div
          key={activeParty.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border p-5"
          style={{ borderColor: `${activeParty.color}40`, background: `${activeParty.color}0d` }}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: `${activeParty.color}1f`, color: activeParty.color }}>
            <activeParty.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold" style={{ color: activeParty.color }}>{activeParty.name}</p>
            <p className="text-sm text-ink-muted">{activeParty.note}</p>
          </div>
        </motion.div>
      </Reveal>

      <Reveal className="mt-6">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-ink-muted">
          {(['yes', 'no', 'partial'] as Knowledge[]).map((k) => {
            const meta = ICONS[k]
            return (
              <span key={k} className="flex items-center gap-1.5">
                <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
                {meta.label}
              </span>
            )
          })}
        </div>
      </Reveal>
    </Section>
  )
}

function Row({ party, active, onSelect }: { party: Party; active: boolean; onSelect: () => void }) {
  const cells: Knowledge[] = [party.identity, party.destination, party.content]
  return (
    <>
      <button
        onClick={onSelect}
        className={cn(
          'flex items-center gap-2.5 p-4 text-left transition-colors',
          active ? 'bg-white/[0.07]' : 'bg-surface hover:bg-white/[0.04]',
        )}
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${party.color}1f`, color: party.color }}>
          <party.icon className="h-4 w-4" />
        </span>
        <span className="font-semibold text-ink">{party.name}</span>
      </button>
      {cells.map((c, i) => {
        const meta = ICONS[c]
        return (
          <div
            key={i}
            className={cn('grid place-items-center p-4 transition-colors', active ? 'bg-white/[0.07]' : 'bg-surface')}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: `${meta.color}1a` }}>
              <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
            </span>
          </div>
        )
      })}
    </>
  )
}
