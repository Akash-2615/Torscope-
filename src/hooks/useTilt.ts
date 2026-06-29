import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltOptions {
  /** max rotation in degrees */
  max?: number
  /** scale applied while hovering (the "magnify") */
  scale?: number
  disabled?: boolean
}

/**
 * 3D tilt + magnify for a liquid-glass card.
 * Tracks the pointer to rotate the element in 3D and exposes a glare position.
 */
export function useTilt({ max = 8, scale = 1.03, disabled = false }: TiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)

  // normalised pointer position in [-0.5, 0.5]
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const hovered = useMotionValue(0)

  const springCfg = { stiffness: 220, damping: 20, mass: 0.4 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), springCfg)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), springCfg)
  const scaleSpring = useSpring(hovered, { stiffness: 260, damping: 22 })
  const scaleValue = useTransform(scaleSpring, [0, 1], [1, scale])

  // glare follows the cursor across the surface
  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%'])

  const onMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseEnter = () => {
    if (!disabled) hovered.set(1)
  }

  const onMouseLeave = () => {
    px.set(0)
    py.set(0)
    hovered.set(0)
  }

  return {
    ref,
    rotateX,
    rotateY,
    scale: scaleValue,
    glareX,
    glareY,
    hovered,
    handlers: { onMouseMove, onMouseEnter, onMouseLeave },
  }
}
