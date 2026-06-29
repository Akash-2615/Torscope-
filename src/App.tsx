import { lazy, Suspense } from 'react'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { DestinationProvider } from '@/context/DestinationContext'
import { useLenis } from '@/hooks/useLenis'
import { NetworkBackground } from '@/components/three/NetworkBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { SectionFallback } from '@/components/layout/SectionFallback'
import { Hero } from '@/sections/Hero'
import { WebLayers } from '@/sections/WebLayers'
import { HowInternet } from '@/sections/HowInternet'
import { GuardRelay } from '@/sections/GuardRelay'
import { MiddleRelay } from '@/sections/MiddleRelay'
import { ExitRelay } from '@/sections/ExitRelay'
import { OnionRouting } from '@/sections/OnionRouting'
import { WhoKnowsWhat } from '@/sections/WhoKnowsWhat'
import { WhyTorSlow } from '@/sections/WhyTorSlow'
import { Advantages } from '@/sections/Advantages'
import { Limitations } from '@/sections/Limitations'
import { Summary } from '@/sections/Summary'

// Heavy WebGL sections are code-split so the initial bundle stays light.
const HowTor = lazy(() => import('@/sections/HowTor').then((m) => ({ default: m.HowTor })))
const NewIdentity = lazy(() =>
  import('@/sections/NewIdentity').then((m) => ({ default: m.NewIdentity })),
)
const LiveTorMap = lazy(() =>
  import('@/sections/LiveTorMap').then((m) => ({ default: m.LiveTorMap })),
)
const DemoMode = lazy(() => import('@/sections/DemoMode').then((m) => ({ default: m.DemoMode })))

function Shell() {
  const { reducedMotion } = useSettings()
  useLenis(!reducedMotion)

  return (
    <>
      <a
        href="#layers"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <div aria-hidden className="fixed inset-0 -z-10 opacity-50">
        <NetworkBackground />
      </div>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <WebLayers />
        <HowInternet />
        <Suspense fallback={<SectionFallback label="Building the globe" />}>
          <HowTor />
        </Suspense>
        <GuardRelay />
        <MiddleRelay />
        <ExitRelay />
        <Suspense fallback={<SectionFallback label="Rerouting circuit" />}>
          <NewIdentity />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Loading TorMap" />}>
          <LiveTorMap />
        </Suspense>
        <OnionRouting />
        <WhoKnowsWhat />
        <WhyTorSlow />
        <Advantages />
        <Limitations />
        <Suspense fallback={<SectionFallback label="Starting demo" />}>
          <DemoMode />
        </Suspense>
        <Summary />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <DestinationProvider>
        <Shell />
      </DestinationProvider>
    </SettingsProvider>
  )
}
