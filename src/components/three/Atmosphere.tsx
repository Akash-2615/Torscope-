import { useMemo } from 'react'
import * as THREE from 'three'

interface AtmosphereProps {
  radius: number
  color?: string
}

/** Fresnel glow shell that gives the globe a soft luminous edge. */
export function Atmosphere({ radius, color = '#3b82f6' }: AtmosphereProps) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = 0.62 - dot(vNormal, vView);
          float intensity = pow(max(rim, 0.0), 3.2) * 0.72;
          gl_FragColor = vec4(uColor, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
  }, [color])

  return (
    <mesh scale={1.055}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
