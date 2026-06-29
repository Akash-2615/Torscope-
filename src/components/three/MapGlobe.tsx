import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { GlobeBase } from './GlobeBase'
import { Starfield } from './Starfield'
import { latLngToVector3 } from '@/lib/geo'
import { ROLE_COLORS } from '@/lib/relays'
import type { Relay } from '@/lib/types'
import { useSettings } from '@/context/SettingsContext'
import { useInView } from '@/hooks/useInView'

const RADIUS = 2

interface MapGlobeProps {
  relays: Relay[]
  selected: Relay | null
  onSelect: (relay: Relay) => void
}

function InteractivePoints({ relays, selected, onSelect }: MapGlobeProps) {
  const [hover, setHover] = useState<number | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { reducedMotion } = useSettings()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(relays.length * 3)
    const colors = new Float32Array(relays.length * 3)
    const c = new THREE.Color()
    relays.forEach((r, i) => {
      const v = latLngToVector3(r.lat, r.lng, RADIUS * 1.01)
      positions[i * 3] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z
      c.set(ROLE_COLORS[r.role])
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    })
    return { positions, colors }
  }, [relays])

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) groupRef.current.rotation.y += delta * 0.02
  })

  const hovered = hover != null ? relays[hover] : null
  const hoverPos = hovered ? latLngToVector3(hovered.lat, hovered.lng, RADIUS * 1.05) : null
  const selPos = selected ? latLngToVector3(selected.lat, selected.lng, RADIUS * 1.05) : null

  return (
    <group ref={groupRef}>
      <GlobeBase radius={RADIUS} />

      <points
        key={relays.length}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          if (e.index != null) setHover(e.index)
        }}
        onPointerOut={() => setHover(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.index != null) onSelect(relays[e.index])
        }}
      >
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {selPos && (
        <mesh position={selPos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={ROLE_COLORS[selected!.role]} toneMapped={false} />
        </mesh>
      )}

      {hovered && hoverPos && (
        <Html position={hoverPos} center distanceFactor={8} zIndexRange={[20, 0]}>
          <div className="pointer-events-none -translate-y-3 whitespace-nowrap rounded-lg border border-white/15 bg-base/90 px-2.5 py-1.5 text-[11px] shadow-glow backdrop-blur">
            <span className="mr-1" aria-hidden>
              {hovered.country.flag}
            </span>
            <span className="font-semibold text-ink">{hovered.country.name}</span>
            <span className="ml-1.5 capitalize" style={{ color: ROLE_COLORS[hovered.role] }}>
              {hovered.role}
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}

export function MapGlobe(props: MapGlobeProps) {
  const { reducedMotion } = useSettings()
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
      dpr={[1, 2]}
      frameloop={inView ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1, 5.6], fov: 42 }}
      raycaster={{ params: { Points: { threshold: 0.04 } } as unknown as THREE.RaycasterParameters }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[2, 2.5, 4]} intensity={1.8} color="#dbe9ff" />
      <pointLight position={[0, 0, 6]} intensity={1.1} color="#bcd2ff" />
      <Suspense fallback={null}>
        <Starfield rotate={!reducedMotion} count={800} />
        <InteractivePoints {...props} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3.2} maxDistance={9} rotateSpeed={0.5} enableDamping />
      </Canvas>
    </div>
  )
}
