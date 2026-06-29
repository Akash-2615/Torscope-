import { useMemo } from 'react'
import * as THREE from 'three'
import type { Relay } from '@/lib/types'
import { ROLE_COLORS } from '@/lib/relays'
import { latLngToVector3 } from '@/lib/geo'

interface GlobeMarkersProps {
  relays: Relay[]
  radius: number
  size?: number
  opacity?: number
}

/** Renders many relays as a single coloured point cloud lifted just off the surface. */
export function GlobeMarkers({ relays, radius, size = 0.03, opacity = 0.9 }: GlobeMarkersProps) {
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(relays.length * 3)
    const colors = new Float32Array(relays.length * 3)
    const color = new THREE.Color()
    relays.forEach((relay, i) => {
      const v = latLngToVector3(relay.lat, relay.lng, radius * 1.01)
      positions[i * 3] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z
      color.set(ROLE_COLORS[relay.role])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    })
    return { positions, colors }
  }, [relays, radius])

  return (
    <points key={relays.length}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size * radius}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
