import * as THREE from 'three'
import type { Country } from './types'

/** Tor-relevant relay countries used across the visualizations. */
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', lat: 38.0, lng: -97.0 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', lat: 51.1, lng: 10.4 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', lat: 52.1, lng: 5.3 },
  { code: 'FR', name: 'France', flag: '🇫🇷', lat: 46.6, lng: 2.2 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', lat: 36.2, lng: 138.3 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', lat: 1.35, lng: 103.8 },
  { code: 'IN', name: 'India', flag: '🇮🇳', lat: 22.0, lng: 79.0 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', lat: 56.1, lng: -106.3 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', lat: 60.1, lng: 18.6 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', lat: 46.8, lng: 8.2 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lat: 55.4, lng: -3.4 },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', lat: 64.0, lng: 26.0 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lat: -25.3, lng: 133.8 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', lat: -14.2, lng: -51.9 },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', lat: 45.9, lng: 24.9 },
]

/** Convert latitude/longitude to a 3D position on a sphere of given radius. */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

/** Tuple variant, handy when constructing geometry buffers. */
export function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const v = latLngToVector3(lat, lng, radius)
  return [v.x, v.y, v.z]
}
