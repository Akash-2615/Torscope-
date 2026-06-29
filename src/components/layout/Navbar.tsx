import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, Volume2, VolumeX, Waves, X, Zap, ZapOff } from 'lucide-react'
import { DestinationPicker } from '@/components/layout/DestinationPicker'
import { SECTIONS } from '@/lib/sections'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useSettings } from '@/context/SettingsContext'
import { cn } from '@/lib/cn'

const NAV_IDS = SECTIONS.map((s) => s.id)
const PRIMARY = SECTIONS.filter((s) => s.primary)

export function Navbar() {
  const active = useActiveSection(NAV_IDS)
  const { soundOn, toggleSound, reducedMotion, toggleReducedMotion, play } = useSettings()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  const go = (id: string) => {
    play('click')
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
      <nav
        className={cn(
          'grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5',
          scrolled ? 'glass shadow-glow-soft' : 'border border-transparent',
        )}
      >
        <button
          onClick={() => go('hero')}
          className="flex items-center gap-2.5 justify-self-start"
          aria-label="TorScope home"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple shadow-glow">
            <Waves className="h-4 w-4 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-base font-bold tracking-tight">
            Tor<span className="text-gradient">Scope</span>
          </span>
        </button>

        <div className="col-start-2 hidden items-center gap-1 justify-self-center lg:flex">
          {PRIMARY.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={cn(
                'relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                active === s.id ? 'text-ink' : 'text-ink-faint hover:text-ink-muted',
              )}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="col-start-3 flex items-center gap-1.5 justify-self-end">
          <DestinationPicker />
          <IconToggle
            on={soundOn}
            onClick={toggleSound}
            label={soundOn ? 'Mute sound' : 'Enable sound'}
            iconOn={<Volume2 className="h-4 w-4" />}
            iconOff={<VolumeX className="h-4 w-4" />}
          />
          <IconToggle
            on={!reducedMotion}
            onClick={toggleReducedMotion}
            label={reducedMotion ? 'Enable motion' : 'Reduce motion'}
            iconOn={<Zap className="h-4 w-4" />}
            iconOff={<ZapOff className="h-4 w-4" />}
          />
          <button
            onClick={() => setOpen((o) => !o)}
            className="ml-1 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-ink-muted lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mt-2 grid grid-cols-2 gap-1 rounded-2xl p-3 lg:hidden"
          >
            {SECTIONS.filter((s) => s.id !== 'hero').map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={cn(
                  'rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  active === s.id ? 'bg-white/10 text-ink' : 'text-ink-muted hover:bg-white/5',
                )}
              >
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.header>
  )
}

function IconToggle({
  on,
  onClick,
  label,
  iconOn,
  iconOff,
}: {
  on: boolean
  onClick: () => void
  label: string
  iconOn: React.ReactNode
  iconOff: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      title={label}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-lg border transition-colors',
        on
          ? 'border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan'
          : 'border-white/10 bg-white/5 text-ink-faint hover:text-ink-muted',
      )}
    >
      {on ? iconOn : iconOff}
    </button>
  )
}
