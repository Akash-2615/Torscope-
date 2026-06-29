import { Waves, Code2, GraduationCap, ShieldCheck } from 'lucide-react'
import { Section } from '@/components/primitives/Section'

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-base/60">
      <Section id="footer" className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple shadow-glow">
                <Waves className="h-4 w-4 text-white" strokeWidth={2.4} />
              </span>
              <span className="text-base font-bold">
                Tor<span className="text-gradient">Scope</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              An interactive, educational visualization of how the Tor network protects privacy
              through onion routing. Built for cybersecurity students and curious minds.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="chip">
                <ShieldCheck className="h-3.5 w-3.5 text-relay-guard" /> Educational use only
              </span>
              <span className="chip">
                <GraduationCap className="h-3.5 w-3.5 text-accent-cyan" /> University friendly
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Learn more</h3>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <a className="hover:text-ink" href="https://www.torproject.org/" target="_blank" rel="noreferrer">
                  The Tor Project
                </a>
              </li>
              <li>
                <a className="hover:text-ink" href="https://metrics.torproject.org/" target="_blank" rel="noreferrer">
                  Tor Metrics
                </a>
              </li>
              <li>
                <a className="hover:text-ink" href="https://support.torproject.org/" target="_blank" rel="noreferrer">
                  Tor Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">About</h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              All relay data, IP addresses and circuits shown here are simulated for teaching network
              routing and anonymity concepts. No real-time or sensitive data is collected.
            </p>
            <a
              href="https://github.com/torproject"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
            >
              <Code2 className="h-4 w-4" /> Open source ecosystem
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} TorScope — Interactive Tor Network Visualization Platform.</p>
          <p>Privacy is a right, not a crime. Use anonymity responsibly and legally.</p>
        </div>
      </Section>
    </footer>
  )
}
