import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Maximize2, Minimize2, MousePointerClick } from 'lucide-react'
import { GlobeBase } from './GlobeBase'
import { Starfield } from './Starfield'
import { GlobeMarkers } from './GlobeMarkers'
import { CircuitArcs } from './CircuitArcs'
import { buildCircuitHops, buildIpFlow } from '@/lib/circuit-path'
import type { Circuit, Relay } from '@/lib/types'
import type { SiteDestination } from '@/lib/destinations'
import { USER_COUNTRY } from '@/lib/constants'
import { BrandIcon } from '@/components/viz/BrandIcon'
import { IpFlow } from '@/components/viz/IpFlow'
import { useSettings } from '@/context/SettingsContext'
import { useDestination } from '@/context/DestinationContext'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'

const RADIUS = 2

interface CircuitGlobeProps {
  circuit: Circuit
  destination: SiteDestination
  ambient?: Relay[]
  controls?: boolean
  autoRotate?: boolean
  className?: string
}

function RotatingGroup({
  children,
  enabled,
  speed,
}: {
  children: React.ReactNode
  enabled: boolean
  speed: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (enabled && ref.current) ref.current.rotation.y += delta * speed
  })
  return <group ref={ref}>{children}</group>
}

export function CircuitGlobe({
  circuit,
  destination,
  ambient,
  controls = true,
  autoRotate = true,
  className,
}: CircuitGlobeProps) {
  const { reducedMotion, play } = useSettings()
  const { presetId } = useDestination()
  const [ref, inView] = useInView<HTMLDivElement>()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const hops = useMemo(
    () => buildCircuitHops(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )
  const ipFlow = useMemo(
    () => buildIpFlow(circuit, USER_COUNTRY, destination),
    [circuit, destination],
  )

  // Native Fullscreen API: the canvas stays mounted (no remount), so the WebGL
  // context is preserved and the globe never squishes on exit. R3F's internal
  // ResizeObserver handles the resize automatically.
  const toggleFullscreen = useCallback(() => {
    play('click')
    const el = ref.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void el.requestFullscreen?.().catch(() => setIsFullscreen((v) => !v))
    }
  }, [play, ref])

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [ref])

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-full w-full overflow-hidden bg-base',
        isFullscreen && 'fixed inset-0 z-[100] h-screen w-screen',
        className,
      )}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={isFullscreen || inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.2, 5.4], fov: 42 }}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[2, 2.5, 4]} intensity={1.8} color="#dbe9ff" />
        <pointLight position={[0, 0, 6]} intensity={1.1} color="#bcd2ff" />
        <pointLight position={[-4, -1, 3]} intensity={0.7} color="#8b5cf6" />
        <Suspense fallback={null}>
          <Starfield rotate={!reducedMotion} count={1000} />
          <RotatingGroup enabled={autoRotate && !reducedMotion} speed={0.06}>
            <GlobeBase radius={RADIUS} />
            {ambient && <GlobeMarkers relays={ambient} radius={RADIUS} size={0.022} opacity={0.5} />}
            <CircuitArcs
              key={`${circuit.id}-${destination.brand}-${destination.country.code}`}
              hops={hops}
              radius={RADIUS}
              animate={!reducedMotion}
            />
          </RotatingGroup>
        </Suspense>
        {controls && (
          <OrbitControls
            enablePan={false}
            minDistance={3.4}
            maxDistance={9}
            rotateSpeed={0.5}
            enableDamping
          />
        )}
      </Canvas>

      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'View globe in fullscreen'}
        className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-base/70 text-ink-muted backdrop-blur transition-colors hover:border-accent-cyan/40 hover:text-ink"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      {/* Agenda / legend — compact normally, expanded in fullscreen */}
      <div
        className={cn(
          'pointer-events-none absolute z-20 rounded-xl border border-white/10 bg-base/80 backdrop-blur transition-all',
          isFullscreen ? 'left-6 top-6 p-5' : 'left-3 top-3 p-3',
        )}
      >
        {isFullscreen && <p className="mb-2 text-sm font-semibold text-ink">Circuit agenda</p>}
        <ul className={cn('space-y-1.5', isFullscreen ? 'text-sm' : 'text-[11px]')}>
          {hops.map((h, i) => (
            <li key={`${h.label}-${i}`} className="flex items-center gap-2 text-ink-muted">
              {i === hops.length - 1 ? (
                <BrandIcon destination={destination} presetId={presetId} size={14} className="shrink-0" />
              ) : (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: h.color, boxShadow: `0 0 8px ${h.color}` }}
                />
              )}
              <span className="font-medium text-ink">
                {i === hops.length - 1 ? h.label : roleName(i)}
              </span>
              <span aria-hidden>{h.flag}</span>
              <span>{h.country}</span>
            </li>
          ))}
        </ul>
        {isFullscreen && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
            <MousePointerClick className="h-3.5 w-3.5" /> Drag to rotate · scroll to zoom · Esc to exit
          </p>
        )}
      </div>

      {/* IP-transition flowchart — synced with the circuit, shown in fullscreen */}
      {isFullscreen && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-5xl px-4 pb-5">
          <div className="rounded-2xl border border-white/10 bg-base/85 p-4 backdrop-blur-md">
            <IpFlow
              steps={ipFlow}
              destination={destination}
              presetId={presetId}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function roleName(index: number): string {
  return ['You', 'Guard', 'Middle', 'Exit', 'Website'][index] ?? ''
}
