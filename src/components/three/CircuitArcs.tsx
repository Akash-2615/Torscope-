import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { buildArc, sampleCurve } from './arc'
import type { CircuitHop } from '@/lib/circuit-path'

interface CircuitArcsProps {
  hops: CircuitHop[]
  radius: number
  animate?: boolean
  speed?: number
  showLabels?: boolean
}

function GlowNode({
  position,
  color,
  pulse,
  hop,
  index,
  showLabel,
}: {
  position: THREE.Vector3
  color: string
  pulse: number
  hop: CircuitHop
  index: number
  showLabel: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [facing, setFacing] = useState(true)
  const worldPos = useRef(new THREE.Vector3())
  const camDir = useRef(new THREE.Vector3())

  // Lane assignment: You/Guard/Middle label above their node, Exit/Website below,
  // so relays that land in the same country (e.g. Middle + Website both in the US)
  // never share the same vertical band.
  const below = index >= 3

  useFrame(({ clock, camera }) => {
    if (ringRef.current) {
      const t = (clock.elapsedTime * 0.7 + pulse) % 1
      ringRef.current.scale.setScalar(1 + t * 2.4)
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (1 - t) * 0.55
    }
    // Hide the label when this node is on the far side of the globe.
    if (showLabel && groupRef.current) {
      groupRef.current.getWorldPosition(worldPos.current)
      camDir.current.copy(camera.position).sub(worldPos.current).normalize()
      const normal = worldPos.current.clone().normalize()
      const isFacing = normal.dot(camDir.current) > 0.02
      if (isFacing !== facing) setFacing(isFacing)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.07, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {showLabel && facing && (
        <Html center distanceFactor={6} zIndexRange={[40 - index, 0]} style={{ pointerEvents: 'none' }}>
          {/* 0×0 anchor sits exactly on the node; leader + box extend from it */}
          <div className="relative h-0 w-0">
            {/* leader line from the node to the label */}
            <span
              className="absolute left-1/2 w-px -translate-x-1/2"
              style={{
                background: color,
                height: 14,
                top: below ? 0 : -14,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border bg-base/90 px-2 py-1 shadow-glow backdrop-blur"
              style={{
                borderColor: `${color}66`,
                top: below ? 14 : 'auto',
                bottom: below ? 'auto' : 14,
              }}
            >
              <div className="flex items-center gap-1.5">
                {isRelayRole(hop.role) && (
                  <span
                    className="rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide"
                    style={{ background: `${color}26`, color }}
                  >
                    {hop.role}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-ink">{hop.label}</span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-muted">
                <span aria-hidden>{hop.flag}</span>
                {hop.country}
              </p>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function isRelayRole(role?: string): boolean {
  return role === 'Guard' || role === 'Middle' || role === 'Exit'
}

export function CircuitArcs({
  hops,
  radius,
  animate = true,
  speed = 0.22,
  showLabels = true,
}: CircuitArcsProps) {
  const segments = useMemo(() => {
    const segs: { points: THREE.Vector3[]; curve: THREE.QuadraticBezierCurve3; color: string }[] = []
    for (let i = 0; i < hops.length - 1; i++) {
      const curve = buildArc(hops[i], hops[i + 1], radius)
      segs.push({ curve, points: sampleCurve(curve, 64), color: hops[i + 1].color })
    }
    return segs
  }, [hops, radius])

  const nodes = useMemo(() => {
    if (segments.length === 0) return []
    return hops.map((h, i) => {
      const position =
        i < segments.length
          ? segments[i].curve.getPoint(0)
          : segments[segments.length - 1].curve.getPoint(1)
      return { hop: h, color: h.color, position, pulse: i * 0.22, index: i }
    })
  }, [hops, segments])

  const packetRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Mesh>(null)
  const progress = useRef(0)

  useFrame((_, delta) => {
    if (!animate || segments.length === 0) return
    progress.current = (progress.current + delta * speed) % 1
    const total = progress.current * segments.length
    const idx = Math.min(Math.floor(total), segments.length - 1)
    const local = total - idx
    if (packetRef.current) packetRef.current.position.copy(segments[idx].curve.getPoint(local))
    if (trailRef.current)
      trailRef.current.position.copy(segments[idx].curve.getPoint(Math.max(0, local - 0.05)))
  })

  return (
    <group>
      {segments.map((seg, i) => (
        <Line
          key={i}
          points={seg.points}
          color={seg.color}
          lineWidth={1.6}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      ))}

      {nodes.map((n, i) => (
        <GlowNode
          key={`${n.hop.label}-${i}`}
          position={n.position}
          color={n.color}
          pulse={n.pulse}
          hop={n.hop}
          index={n.index}
          showLabel={showLabels}
        />
      ))}

      {animate && (
        <>
          <mesh ref={packetRef}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh ref={trailRef}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} toneMapped={false} />
          </mesh>
        </>
      )}
    </group>
  )
}
