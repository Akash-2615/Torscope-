import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  Video,
  ShoppingCart,
  Mail,
  Landmark,
  HeartPulse,
  GraduationCap,
  Newspaper,
  ShieldCheck,
  Globe,
  ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { useSettings } from '@/context/SettingsContext'
import { cn } from '@/lib/cn'

interface Example {
  name: string
  desc: string
  icon: LucideIcon
}

interface Layer {
  id: string
  title: string
  depth: string
  share: string
  blurb: string
  detail: string
  color: string
  glow: string
  examples: Example[]
}

const LAYERS: Layer[] = [
  {
    id: 'surface',
    title: 'Surface Web',
    depth: 'Indexed & public',
    share: '~4–10% of the web',
    blurb: 'Everything search engines can crawl and anyone can reach with a normal browser.',
    detail:
      'The Surface Web is the publicly indexed portion of the internet. Search engines like Google crawl and rank these pages, so they appear in results and are reachable without any credentials.',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.25)',
    examples: [
      { name: 'Google', desc: 'Public search results', icon: Search },
      { name: 'YouTube', desc: 'Public video platform', icon: Video },
      { name: 'Amazon', desc: 'Public storefront pages', icon: ShoppingCart },
    ],
  },
  {
    id: 'deep',
    title: 'Deep Web',
    depth: 'Private & gated',
    share: 'The vast majority of the web',
    blurb: 'Legitimate content behind logins and paywalls — not indexed, but completely normal.',
    detail:
      'The Deep Web is simply everything not indexed by search engines: your email inbox, online banking dashboard, medical portals, university systems. It is private by design and entirely legal — most of your daily internet use lives here.',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    examples: [
      { name: 'Email Inbox', desc: 'Login-protected messages', icon: Mail },
      { name: 'Online Banking', desc: 'Your private accounts', icon: Landmark },
      { name: 'Hospital Records', desc: 'Protected health data', icon: HeartPulse },
      { name: 'University Portal', desc: 'Student/faculty systems', icon: GraduationCap },
    ],
  },
  {
    id: 'dark',
    title: 'Dark Web',
    depth: 'Overlay networks',
    share: 'A tiny fraction of the Deep Web',
    blurb: 'Sites reachable only through anonymity networks like Tor, using .onion addresses.',
    detail:
      'The Dark Web is content hosted on overlay networks such as Tor and reachable only with special software. Importantly, it is also used for legitimate privacy: secure whistleblowing, censorship-resistant journalism, and privacy-respecting mirrors of mainstream services.',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
    examples: [
      { name: 'SecureDrop', desc: 'Anonymous tips for newsrooms', icon: ShieldCheck },
      { name: 'News Mirrors', desc: 'Censorship-resistant journalism', icon: Newspaper },
      { name: 'Privacy Services', desc: '.onion sites for safe access', icon: Globe },
    ],
  },
]

export function WebLayers() {
  const [open, setOpen] = useState<string | null>('surface')
  const { play, reducedMotion } = useSettings()

  return (
    <Section id="layers" grid>
      <SectionHeading
        eyebrow="Section 01 — The Layers"
        title={
          <>
            Surface, Deep & <span className="text-gradient">Dark</span> Web
          </>
        }
        subtitle="Three layers, often misunderstood. Click each layer to expand it and see real, everyday examples — no illegal content, just how the web is structured."
      />

      <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-3">
        {LAYERS.map((layer, idx) => {
          const isOpen = open === layer.id
          return (
            <Reveal key={layer.id} delay={idx * 0.08}>
              <motion.div
                layout={!reducedMotion}
                className="glow-border overflow-hidden rounded-2xl bg-surface/70 backdrop-blur-xl"
                style={{ boxShadow: isOpen ? `0 0 40px -12px ${layer.glow}` : undefined }}
              >
                <button
                  onClick={() => {
                    play('click')
                    setOpen(isOpen ? null : layer.id)
                  }}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-bold"
                    style={{ background: `${layer.color}1f`, color: layer.color }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold sm:text-xl">{layer.title}</h3>
                      <span
                        className="hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline"
                        style={{ background: `${layer.color}1a`, color: layer.color }}
                      >
                        {layer.depth}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-muted">{layer.blurb}</p>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-ink-faint">
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 px-5 pb-6 pt-5 sm:px-6">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                          <span className="chip" style={{ color: layer.color }}>
                            {layer.share}
                          </span>
                        </div>
                        <p className="mb-5 text-sm leading-relaxed text-ink-muted">{layer.detail}</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {layer.examples.map((ex, i) => (
                            <motion.div
                              key={ex.name}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * i + 0.1 }}
                              className={cn(
                                'group rounded-xl border border-white/10 bg-white/[0.03] p-4',
                                'transition-colors hover:bg-white/[0.06]',
                              )}
                            >
                              <ex.icon
                                className="mb-2 h-5 w-5 transition-transform group-hover:scale-110"
                                style={{ color: layer.color }}
                              />
                              <p className="text-sm font-semibold text-ink">{ex.name}</p>
                              <p className="text-xs text-ink-faint">{ex.desc}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          )
        })}
      </div>

      <Reveal>
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-ink-faint">
          Note: The Dark Web is a tool. Like any tool it can be misused, but it also enables
          journalism, privacy and free expression. This platform focuses only on the technology.
        </p>
      </Reveal>
    </Section>
  )
}
