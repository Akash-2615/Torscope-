import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MapPin, Check } from 'lucide-react'
import { useDestination } from '@/context/DestinationContext'
import { useSettings } from '@/context/SettingsContext'
import { DESTINATION_PRESETS, countryByCode } from '@/lib/destinations'
import { BrandIcon } from '@/components/viz/BrandIcon'
import { SiteLink } from '@/components/viz/SiteLink'
import { setScrollLocked } from '@/hooks/useLenis'
import { cn } from '@/lib/cn'

export function DestinationPicker() {
  const { destination, presetId, setPreset } = useDestination()
  const { play } = useSettings()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null)

  const openPanel = () => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect()
      setAnchor({ top: r.bottom + 8, right: Math.max(window.innerWidth - r.right, 8) })
    }
    play('click')
    setOpen((o) => !o)
  }

  useEffect(() => {
    if (!open) return
    setScrollLocked(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
  }, [open])

  return (
    <div className="relative hidden sm:block">
      <button
        ref={buttonRef}
        type="button"
        onClick={openPanel}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Choose website destination"
        className={cn(
          'flex max-w-[200px] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors',
          open
            ? 'border-accent-cyan/40 bg-accent-cyan/10 text-ink'
            : 'border-white/10 bg-white/5 text-ink-muted hover:border-white/20 hover:text-ink',
        )}
      >
        <BrandIcon destination={destination} presetId={presetId} size={18} />
        <span className="min-w-0 flex-1 truncate text-xs font-medium">{destination.brand}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && anchor && (
            <>
              {/* Backdrop — blurs + darkens everything behind the panel */}
              <motion.div
                key="dest-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[90] bg-base/75 backdrop-blur-md"
              />
              {/* Panel sits above the backdrop so it stays sharp */}
              <motion.div
                key="dest-panel"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ top: anchor.top, right: anchor.right }}
                className="fixed z-[100] w-[min(92vw,360px)] rounded-2xl border border-white/15 bg-surface/95 p-4 shadow-glow"
                role="dialog"
                aria-label="Website destination settings"
              >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-cyan">
              Choose a website
            </p>
            <p className="mb-3 mt-1 text-[11px] leading-relaxed text-ink-muted">
              Pick the site you want to visit — its server location is fixed by the company.
            </p>

            <div
              data-lenis-prevent
              className="grid max-h-[52vh] grid-cols-1 gap-1.5 overflow-y-auto overscroll-contain pr-1"
            >
              {DESTINATION_PRESETS.map((p) => {
                const country = countryByCode(p.countryCode)
                const selected = presetId === p.id
                const dest = { brand: p.brand, domain: p.domain, country }
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      play('click')
                      setPreset(p.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                      selected
                        ? 'border-accent-cyan/50 bg-accent-cyan/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]',
                    )}
                  >
                    <BrandIcon destination={dest} presetId={p.id} size={32} className="mt-0.5" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-ink">{p.brand}</span>
                        {selected && <Check className="h-4 w-4 shrink-0 text-accent-cyan" />}
                      </span>
                      <span className="mt-1 block" onClick={(e) => e.stopPropagation()} role="presentation">
                        <SiteLink destination={dest} presetId={p.id} stopPropagation compact />
                      </span>
                      <span className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-ink-muted">
                        <MapPin className="h-3 w-3 shrink-0 text-accent-purple" />
                        Server: {country.flag} {country.name}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                Active destination
              </p>
              <div className="flex items-center gap-2.5">
                <BrandIcon destination={destination} presetId={presetId} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{destination.brand}</p>
                  <SiteLink destination={destination} presetId={presetId} compact />
                </div>
              </div>
            </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
