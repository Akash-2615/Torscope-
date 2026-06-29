import { motion } from 'framer-motion'
import { DoorOpen, EyeOff, Eye, Globe, ArrowRight, Lock } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Reveal } from '@/components/primitives/Reveal'
import { GlowCard } from '@/components/primitives/GlowCard'
import { KnowsRow } from '@/components/viz/KnowsRow'
import { useCircuit } from '@/hooks/useCircuit'
import { useDestination } from '@/context/DestinationContext'
import { USER_COUNTRY } from '@/lib/constants'
import { SiteLink } from '@/components/viz/SiteLink'
import { BrandIcon } from '@/components/viz/BrandIcon'

export function ExitRelay() {
  const { circuit } = useCircuit()
  const { destination, presetId } = useDestination()

  return (
    <Section id="exit">
      <SectionHeading
        align="left"
        eyebrow="Section 06 — Relay 3 of 3"
        title={
          <>
            The <span className="text-relay-exit">Exit</span> Relay
          </>
        }
        subtitle="The last hop. The Exit relay decrypts the final layer and sends your request to the website. To the destination, the traffic appears to come from the Exit — not from you."
      />

      <div className="mt-12 grid items-center gap-6 lg:grid-cols-2">
        <Reveal direction="right">
          <GlowCard className="p-6 sm:p-8">
            <p className="mb-5 text-center text-sm font-medium text-ink-muted">
              What{' '}
              <span className="inline-flex items-center gap-1.5 text-ink">
                <BrandIcon destination={destination} presetId={presetId} size={16} />
                <SiteLink destination={destination} presetId={presetId} compact showIcon={false} />
              </span>{' '}
              actually sees
            </p>

            <div className="space-y-4">
              <IpCard
                title="Your real IP"
                ip="223.184.45.102"
                location={`${USER_COUNTRY.name}`}
                hidden
                delay={0.1}
              />

              <div className="flex justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 rounded-full border border-relay-exit/30 bg-relay-exit/10 px-3 py-1 text-xs text-relay-exit"
                >
                  <DoorOpen className="h-3.5 w-3.5" /> swapped at exit <ArrowRight className="h-3 w-3" />
                </motion.span>
              </div>

              <IpCard
                title={`Exit IP (what ${destination.brand} logs)`}
                ip={circuit.exit.ip}
                location={`${circuit.exit.country.name}`}
                hidden={false}
                delay={0.25}
              />
            </div>
          </GlowCard>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div className="flex flex-col gap-4">
            <GlowCard className="p-6">
              <h3 className="mb-1 flex items-center gap-2 text-lg font-bold">
                <Globe className="h-5 w-5 text-relay-exit" /> {destination.brand} is fooled — by design
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {destination.brand} ({destination.country.flag} {destination.country.name}) only ever talks to
                the Exit relay, so it logs the Exit&apos;s IP and location — not yours. Your real identity stays
                hidden behind three layers of encryption and three independent relays.
              </p>
            </GlowCard>

            <GlowCard className="p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">What the Exit knows</h3>
              <div className="space-y-2">
                <KnowsRow label="Your real IP address" knows={false} />
                <KnowsRow label={`The website you're visiting (${destination.domain})`} knows />
                <KnowsRow label="Unencrypted traffic (if not HTTPS)" knows />
              </div>
              <p className="mt-3 flex items-start gap-2 text-xs text-ink-faint">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-cyan" />
                This is why HTTPS still matters on Tor — it protects the content from the Exit relay.
              </p>
            </GlowCard>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function IpCard({
  title,
  ip,
  location,
  hidden,
  delay,
}: {
  title: string
  ip: string
  location: string
  hidden: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-xl border p-4 ${
        hidden ? 'border-relay-guard/30 bg-relay-guard/5' : 'border-relay-exit/30 bg-relay-exit/5'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hidden ? (
            <EyeOff className="h-4 w-4 text-relay-guard" />
          ) : (
            <Eye className="h-4 w-4 text-relay-exit" />
          )}
          <span className="text-xs text-ink-faint">{title}</span>
        </div>
        <span className="text-xs text-ink-faint">{location}</span>
      </div>
      <p
        className={`mt-1.5 font-mono text-xl font-semibold tracking-tight sm:text-2xl ${
          hidden ? 'text-ink-faint line-through decoration-relay-guard/60' : 'text-relay-exit'
        }`}
      >
        {ip}
      </p>
    </motion.div>
  )
}
