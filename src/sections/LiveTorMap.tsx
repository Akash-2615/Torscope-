import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Server, Radio, Network as NetIcon, MapPin, Filter } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { Magnify } from '@/components/primitives/Magnify'
import { MapGlobe } from '@/components/three/MapGlobe'
import { AnimatedNumber } from '@/components/primitives/AnimatedNumber'
import { generateRelays, ROLE_COLORS, ROLE_LABEL } from '@/lib/relays'
import type { Relay, RelayRole } from '@/lib/types'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'

type FilterRole = RelayRole | 'all'

const FILTERS: { id: FilterRole; label: string; color: string }[] = [
  { id: 'all', label: 'All relays', color: '#9aa6c8' },
  { id: 'guard', label: 'Guard', color: ROLE_COLORS.guard },
  { id: 'middle', label: 'Middle', color: ROLE_COLORS.middle },
  { id: 'exit', label: 'Exit', color: ROLE_COLORS.exit },
]

export function LiveTorMap() {
  const all = useMemo(() => generateRelays(1600, 4242), [])
  const [role, setRole] = useState<FilterRole>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Relay | null>(null)
  const { play } = useSettings()
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return all.filter(
      (r) =>
        (role === 'all' || r.role === role) &&
        (q === '' || r.country.name.toLowerCase().includes(q) || r.country.code.toLowerCase() === q),
    )
  }, [all, role, deferredQuery])

  const counts = useMemo(() => {
    return {
      guard: all.filter((r) => r.role === 'guard').length,
      middle: all.filter((r) => r.role === 'middle').length,
      exit: all.filter((r) => r.role === 'exit').length,
    }
  }, [all])

  const clusters = useMemo(() => {
    const map = new Map<string, { flag: string; name: string; count: number }>()
    for (const r of filtered) {
      const k = r.country.code
      const e = map.get(k) ?? { flag: r.country.flag, name: r.country.name, count: 0 }
      e.count++
      map.set(k, e)
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8)
  }, [filtered])

  return (
    <Section id="tormap">
      <SectionHeading
        eyebrow="Section 08 — The Network"
        title={
          <>
            The Live <span className="text-gradient">TorMap</span>
          </>
        }
        subtitle="The real Tor network runs on thousands of volunteer relays worldwide. Explore a representative sample — filter by role, search a country, and click any node for details."
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Relays worldwide" value={9800} suffix="+" color="#22d3ee" />
        <Stat label="Guard relays" value={counts.guard} color={ROLE_COLORS.guard} icon={<Server className="h-4 w-4" />} />
        <Stat label="Middle relays" value={counts.middle} color={ROLE_COLORS.middle} icon={<Radio className="h-4 w-4" />} />
        <Stat label="Exit relays" value={counts.exit} color={ROLE_COLORS.exit} icon={<NetIcon className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal scale>
          <GlowCard tilt={false} spotlight={false} className="relative h-[440px] overflow-hidden p-0 sm:h-[560px]">
            <MapGlobe relays={filtered} selected={selected} onSelect={(r) => { play('click'); setSelected(r) }} />
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
              {FILTERS.slice(1).map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
                  {f.label}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-md bg-base/70 px-2 py-1 text-[11px] text-ink-faint backdrop-blur">
              showing <span className="text-ink">{filtered.length}</span> nodes
            </div>
          </GlowCard>
        </Reveal>

        <div className="flex flex-col gap-4">
          <Reveal direction="left">
            <GlowCard className="p-5">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a country (e.g. Germany)"
                  aria-label="Search relays by country"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-faint focus:border-accent-cyan/40 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Filter className="h-3.5 w-3.5" /> Filter by role
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { play('click'); setRole(f.id) }}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      role === f.id
                        ? 'border-white/20 bg-white/10 text-ink'
                        : 'border-white/10 bg-white/[0.02] text-ink-muted hover:bg-white/5',
                    )}
                    style={role === f.id ? { color: f.color } : undefined}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </GlowCard>
          </Reveal>

          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <GlowCard className="p-5" spotlight={false}>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl" aria-hidden>{selected.country.flag}</span>
                      <div>
                        <p className="font-mono text-sm font-semibold text-ink">{selected.nickname}</p>
                        <p className="text-xs" style={{ color: ROLE_COLORS[selected.role] }}>
                          {ROLE_LABEL[selected.role]}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)} aria-label="Close details" className="text-ink-faint hover:text-ink">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <Detail icon={<MapPin className="h-3.5 w-3.5" />} label="Country" value={selected.country.name} />
                    <Detail label="Bandwidth" value={`${selected.bandwidthMbps} Mb/s`} />
                    <Detail label="ASN" value={selected.asn} />
                    <Detail label="AS Name" value={selected.asName} />
                    <Detail label="Exit/Relay IP" value={selected.ip} />
                    <Detail label="Latency" value={`${selected.latencyMs} ms`} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.flags.map((fl) => (
                      <span
                        key={fl}
                        className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ borderColor: `${ROLE_COLORS[selected.role]}40`, color: ROLE_COLORS[selected.role] }}
                      >
                        {fl}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            ) : (
              <motion.div key="clusters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlowCard className="p-5" spotlight={false}>
                  <h3 className="mb-3 text-sm font-semibold text-ink">Top countries (clusters)</h3>
                  <div className="space-y-1.5">
                    {clusters.map((c) => (
                      <div key={c.name} className="flex items-center gap-3">
                        <span aria-hidden>{c.flag}</span>
                        <span className="w-28 shrink-0 truncate text-sm text-ink-muted">{c.name}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple"
                            style={{ width: `${(c.count / (clusters[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-ink-faint">{c.count}</span>
                      </div>
                    ))}
                    {clusters.length === 0 && (
                      <p className="text-sm text-ink-faint">No relays match your search.</p>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-ink-faint">Click a node on the globe to inspect it.</p>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}

function Stat({
  label,
  value,
  color,
  suffix,
  icon,
}: {
  label: string
  value: number
  color: string
  suffix?: string
  icon?: React.ReactNode
}) {
  return (
    <Reveal>
      <Magnify className="p-4" scale={1.05}>
        <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-faint">
          {icon}
          {label}
        </div>
        <p className="text-2xl font-bold" style={{ color }}>
          <AnimatedNumber value={value} />
          {suffix}
        </p>
      </Magnify>
    </Reveal>
  )
}

function Detail({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <Magnify className="p-2.5" scale={1.07}>
      <div className="mb-0.5 flex items-center gap-1 text-ink-faint">
        {icon}
        {label}
      </div>
      <p className="truncate font-mono font-medium text-ink">{value}</p>
    </Magnify>
  )
}
