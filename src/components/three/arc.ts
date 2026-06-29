import * as THREE from 'three'
import { latLngToVector3 } from '@/lib/geo'

export interface GeoPoint {
  lat: number
  lng: number
}

/** Build a lifted quadratic bezier arc between two surface points. */
export function buildArc(a: GeoPoint, b: GeoPoint, radius: number): THREE.QuadraticBezierCurve3 {
  const start = latLngToVector3(a.lat, a.lng, radius * 1.01)
  const end = latLngToVector3(b.lat, b.lng, radius * 1.01)
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const dist = start.distanceTo(end)
  // lift the control point proportionally to the distance for a nice great-circle-ish bow
  mid.normalize().multiplyScalar(radius + dist * 0.55 + radius * 0.08)
  return new THREE.QuadraticBezierCurve3(start, mid, end)
}

/** Sample a curve into an array of Vector3 for line rendering. */
export function sampleCurve(curve: THREE.Curve<THREE.Vector3>, segments = 60): THREE.Vector3[] {
  return curve.getPoints(segments)
}
