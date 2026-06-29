import { useEffect } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { Atmosphere } from './Atmosphere'

interface GlobeBaseProps {
  radius: number
  /** kept for backwards-compatibility with earlier callers */
  dotCount?: number
}

/**
 * Photoreal Earth: blue-marble base + subtle glowing city-lights (emissive night map)
 * + topology bump + fresnel atmosphere. Tuned for the dark cyber theme.
 */
export function GlobeBase({ radius }: GlobeBaseProps) {
  const [earthMap, nightMap, bumpMap] = useTexture([
    '/textures/earth-blue-marble.jpg',
    '/textures/earth-night.jpg',
    '/textures/earth-topology.png',
  ])

  useEffect(() => {
    for (const tex of [earthMap, nightMap]) {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      tex.needsUpdate = true
    }
  }, [earthMap, nightMap])

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial
          map={earthMap}
          color="#7fb6ff"
          emissive="#ffffff"
          emissiveMap={nightMap}
          emissiveIntensity={0.22}
          bumpMap={bumpMap}
          bumpScale={0.08}
          metalness={0.05}
          roughness={0.78}
        />
      </mesh>

      <Atmosphere radius={radius} />
    </group>
  )
}
