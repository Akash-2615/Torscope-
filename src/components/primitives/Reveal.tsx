import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useSettings } from '@/context/SettingsContext'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
  /** scale-in for emphasis */
  scale?: boolean
  amount?: number
  /** Re-run the animation every time it enters the viewport (both scroll directions). */
  once?: boolean
  /** Adds a 3D tilt to the incoming transition. */
  tilt?: boolean
  /**
   * Opacity-only reveal with no transform. Use for wrappers that contain a
   * fullscreen target (a CSS transform would become its containing block and
   * break the native Fullscreen API).
   */
  flat?: boolean
}

const OFFSET: Record<Direction, { x: number; y: number; rx: number; ry: number }> = {
  up: { x: 0, y: 34, rx: 3, ry: 0 },
  down: { x: 0, y: -34, rx: -3, ry: 0 },
  left: { x: 34, y: 0, rx: 0, ry: -3 },
  right: { x: -34, y: 0, rx: 0, ry: 3 },
  none: { x: 0, y: 0, rx: 2, ry: 0 },
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
  scale = false,
  amount = 0.25,
  once = false,
  tilt = true,
  flat = false,
}: RevealProps) {
  const { reducedMotion } = useSettings()
  const offset = OFFSET[direction]

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  if (flat) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount, margin: '-8% 0px -8% 0px' }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1100 }}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        rotateX: tilt ? offset.rx : 0,
        rotateY: tilt ? offset.ry : 0,
        scale: scale ? 0.96 : 1,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
      viewport={{ once, amount, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
