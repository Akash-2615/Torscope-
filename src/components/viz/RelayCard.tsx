import { motion } from 'framer-motion'
import { Gauge, Radio, MapPin, Network } from 'lucide-react'
import type { Relay } from '@/lib/types'
import { ROLE_COLORS, ROLE_LABEL } from '@/lib/relays'
import { cn } from '@/lib/cn'
import { Magnify } from '@/components/primitives/Magnify'
import { useSettings } from '@/context/SettingsContext'

interface RelayCardProps {
  relay: Relay
  index?: number
  className?: string
}

export function RelayCard({ relay, index = 0, className }: RelayCardProps) {
  const color = ROLE_COLORS[relay.role]
  const { reducedMotion } = useSettings()
  return (
    <motion.div
      key={relay.id}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={reducedMotion ? undefined : { scale: 1.02, y: -2 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'liquid-glass glow-border relative overflow-hidden rounded-2xl p-5',
        className,
      )}
      style={{ boxShadow: `0 0 30px -14px ${color}` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold"
            style={{ background: `${color}22`, color }}
          >
            {relay.role === 'guard' ? '1' : relay.role === 'middle' ? '2' : '3'}
          </span>
          <div>
            <p className="text-sm font-bold" style={{ color }}>
              {ROLE_LABEL[relay.role]}
            </p>
            <p className="flex items-center gap-1 text-xs text-ink-muted">
              <span aria-hidden>{relay.country.flag}</span>
              {relay.country.name}
            </p>
            <p className="font-mono text-[11px] text-ink-faint">{relay.nickname}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl" aria-hidden>
            {relay.country.flag}
          </span>
          <p className="mt-0.5 text-[10px] font-medium text-ink-faint">{relay.country.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <Stat icon={<MapPin className="h-3.5 w-3.5" />} label="Country" value={relay.country.name} />
        <Stat icon={<Gauge className="h-3.5 w-3.5" />} label="Latency" value={`${relay.latencyMs} ms`} />
        <Stat
          icon={<Radio className="h-3.5 w-3.5" />}
          label="Bandwidth"
          value={`${relay.bandwidthMbps} Mb/s`}
        />
        <Stat icon={<Network className="h-3.5 w-3.5" />} label="ASN" value={relay.asn} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {relay.flags.map((flag) => (
          <span
            key={flag}
            className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
            style={{ borderColor: `${color}40`, color }}
          >
            {flag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Magnify className="p-2.5" scale={1.08}>
      <div className="mb-0.5 flex items-center gap-1 text-ink-faint">
        {icon}
        {label}
      </div>
      <p className="truncate font-medium text-ink">{value}</p>
    </Magnify>
  )
}
