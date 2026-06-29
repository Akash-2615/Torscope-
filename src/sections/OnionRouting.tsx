import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, RotateCcw, ShieldCheck, Repeat, DoorOpen, FileText, Check } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { MagneticButton } from '@/components/primitives/MagneticButton'
import { useSettings } from '@/context/SettingsContext'

const LAYERS = [
  { id: 0, name: 'Layer 1 — Guard key', color: '#34D399', r: 130 },
  { id: 1, name: 'Layer 2 — Middle key', color: '#A78BFA', r: 98 },
  { id: 2, name: 'Layer 3 — Exit key', color: '#F87171', r: 66 },
]

const STEPS = [
  { icon: ShieldCheck, color: '#34D399', title: 'Guard peels Layer 1', desc: 'Removes the outermost encryption with its key.' },
  { icon: Repeat, color: '#A78BFA', title: 'Middle peels Layer 2', desc: 'Removes the next layer, still cannot read the core.' },
  { icon: DoorOpen, color: '#F87171', title: 'Exit peels Layer 3', desc: 'Removes the final layer, revealing the request.' },
  { icon: FileText, color: '#22d3ee', title: 'Website receives data', desc: 'The plaintext request finally arrives at the destination.' },
]

export function OnionRouting() {
  const [peeled, setPeeled] = useState(0)
  const [playing, setPlaying] = useState(false)
  const { play, reducedMotion } = useSettings()

  useEffect(() => {
    if (!playing) return
    if (peeled >= 3) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => {
      setPeeled((p) => p + 1)
      play('transmit')
    }, 1100)
    return () => clearTimeout(t)
  }, [playing, peeled, play])

  const start = () => {
    play('click')
    setPeeled(0)
    setPlaying(true)
  }
  const reset = () => {
    play('click')
    setPlaying(false)
    setPeeled(0)
  }

  return (
    <Section id="onion" grid>
      <SectionHeading
        eyebrow="Section 09 — The Onion"
        title={
          <>
            Why It's Called <span className="text-gradient">Onion</span> Routing
          </>
        }
        subtitle="Your data is wrapped in three layers of encryption — one per relay. Each relay peels off exactly one layer, like an onion, until the request reaches its destination."
      />

      <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
        <Reveal scale>
          <GlowCard className="grid place-items-center p-8">
            <svg viewBox="0 0 320 320" className="h-72 w-72 sm:h-80 sm:w-80">
              <defs>
                <radialGradient id="core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </radialGradient>
              </defs>
              {LAYERS.map((layer) => {
                const isPeeled = peeled > layer.id
                return (
                  <AnimatePresence key={layer.id}>
                    {!isPeeled && (
                      <motion.circle
                        cx={160}
                        cy={160}
                        r={layer.r}
                        fill="none"
                        stroke={layer.color}
                        strokeWidth={18}
                        initial={false}
                        animate={{ opacity: peeled === layer.id ? [1, 0.4, 1] : 0.85 }}
                        exit={reducedMotion ? { opacity: 0 } : { scale: 1.25, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ filter: `drop-shadow(0 0 8px ${layer.color})`, transformOrigin: 'center' }}
                      />
                    )}
                  </AnimatePresence>
                )
              })}
              <motion.circle
                cx={160}
                cy={160}
                r={40}
                fill="url(#core)"
                animate={{ scale: peeled >= 3 ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.6, repeat: peeled >= 3 ? Infinity : 0 }}
                style={{ transformOrigin: 'center', filter: 'drop-shadow(0 0 14px #22d3ee)' }}
              />
              <text x={160} y={166} textAnchor="middle" className="fill-white text-[13px] font-semibold">
                DATA
              </text>
            </svg>

            <div className="mt-4 flex gap-3">
              <MagneticButton onClick={start} disabled={playing}>
                <Play className="h-4 w-4" /> Send Packet
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Reset
              </MagneticButton>
            </div>
          </GlowCard>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const active = peeled === i || (peeled >= 3 && i === 3)
              const done = peeled > i
              return (
                <motion.div
                  key={step.title}
                  animate={{
                    borderColor: active ? `${step.color}66` : 'rgba(255,255,255,0.08)',
                    backgroundColor: active ? `${step.color}12` : 'rgba(255,255,255,0.02)',
                  }}
                  className="flex items-center gap-4 rounded-2xl border p-4"
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors"
                    style={{ background: `${step.color}1f`, color: step.color }}
                  >
                    {done ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="text-sm text-ink-muted">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
