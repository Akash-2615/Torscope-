import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import { GlobeBase } from '@/components/three/GlobeBase'
import { Starfield } from '@/components/three/Starfield'
import { CircuitArcs } from '@/components/three/CircuitArcs'
import { MagneticButton } from '@/components/primitives/MagneticButton'
import { buildCircuitHops } from '@/lib/circuit-path'
import { generateRelays, pickCircuit, ROLE_COLORS } from '@/lib/relays'
import { useSettings } from '@/context/SettingsContext'
import { useDestination } from '@/context/DestinationContext'
import type { SiteDestination } from '@/lib/destinations'
import { USER_COUNTRY } from '@/lib/constants'
import { useInView } from '@/hooks/useInView'

const RADIUS = 1.72

function HeroScene({
  progress,
  reduced,
  destination,
}: {
  progress: MotionValue<number>
  reduced: boolean
  destination: SiteDestination
}) {
  const groupRef = useRef<THREE.Group>(null)
  const markerMat = useRef<THREE.PointsMaterial>(null)

  const relays = useMemo(() => generateRelays(220, 7), [])
  const demoCircuit = useMemo(() => pickCircuit(7), [])
  const hops = useMemo(
    () => buildCircuitHops(demoCircuit, USER_COUNTRY, destination),
    [demoCircuit, destination],
  )

  useFrame((state, delta) => {
    const p = progress.get()
    if (groupRef.current && !reduced) groupRef.current.rotation.y += delta * 0.06
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.8 - p * 2.2, 0.08)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.0 - p * 0.55, 0.08)
    state.camera.lookAt(0, 0, 0)
    if (markerMat.current) markerMat.current.opacity = THREE.MathUtils.clamp(p * 1.6, 0, 0.95)
  })

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[2, 2.5, 4]} intensity={2.2} color="#d8e7ff" />
      <pointLight position={[-4, -1, 3]} intensity={0.9} color="#8b5cf6" />
      <Starfield rotate={!reduced} />
      <group ref={groupRef}>
        <GlobeBase radius={RADIUS} />
        <HeroMarkers relays={relays} matRef={markerMat} />
        <CircuitArcs
          key={`${demoCircuit.id}-${destination.country.code}-${destination.brand}`}
          hops={hops}
          radius={RADIUS}
          animate={!reduced}
          speed={0.18}
          showLabels={false}
        />
      </group>
    </>
  )
}

function HeroMarkers({
  relays,
  matRef,
}: {
  relays: ReturnType<typeof generateRelays>
  matRef: React.RefObject<THREE.PointsMaterial | null>
}) {
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(relays.length * 3)
    const colors = new Float32Array(relays.length * 3)
    const color = new THREE.Color()
    relays.forEach((relay, i) => {
      const phi = (90 - relay.lat) * (Math.PI / 180)
      const theta = (relay.lng + 180) * (Math.PI / 180)
      const r = RADIUS * 1.01
      positions[i * 3] = -r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      color.set(ROLE_COLORS[relay.role])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    })
    return { positions, colors }
  }, [relays])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function Hero() {
  const { reducedMotion } = useSettings()
  const { destination } = useDestination()
  const ref = useRef<HTMLDivElement>(null)
  const [canvasRef, inView] = useInView<HTMLDivElement>('0px')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  return (
    <section id="hero" ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          frameloop={inView ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 1, 5.8], fov: 42 }}
        >
          <Suspense fallback={null}>
            <HeroScene progress={scrollYProgress} reduced={reducedMotion} destination={destination} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base/10 via-transparent to-base" />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="chip mb-6 border-accent-purple/30 bg-accent-purple/10 text-accent-cyan"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Interactive Tor Network Visualization Platform
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Visualizing <span className="text-gradient">Anonymous</span>
          <br className="hidden sm:block" /> Communication Networks
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg"
        >
          Understand how Tor protects privacy using <strong className="text-relay-guard">Entry / Guard</strong>,{' '}
          <strong className="text-relay-middle">Middle</strong> and{' '}
          <strong className="text-relay-exit">Exit</strong> relays — one glowing packet at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            onClick={() => document.getElementById('how-tor')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })}
          >
            Explore Tor
            <ArrowDown className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => document.getElementById('layers')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })}
          >
            Start the journey
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-ink-faint">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <motion.span
            animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  )
}
