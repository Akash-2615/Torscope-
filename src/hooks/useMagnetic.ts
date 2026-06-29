import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/** Returns refs + motion values to create a magnetic hover effect on an element. */
export function useMagnetic(strength = 0.4, disabled = false) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { ref, x: sx, y: sy, onMouseMove, onMouseLeave }
}
