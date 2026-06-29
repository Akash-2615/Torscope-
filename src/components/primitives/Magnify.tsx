import type { ReactNode } from 'react'
import { motion, useMotionTemplate } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'
import { useTilt } from '@/hooks/useTilt'

interface MagnifyProps {
  children: ReactNode
  className?: string
  /** scale on hover */
  scale?: number
  /** disable the 3D tilt (keeps only the magnify) */
  flat?: boolean
}

/** Small liquid-glass tile with a reactive 3D tilt + magnify on hover. */
export function Magnify({ children, className, scale = 1.04, flat = false }: MagnifyProps) {
  const { reducedMotion } = useSettings()
  const disabled = reducedMotion
  const { ref, rotateX, rotateY, scale: scaleValue, glareX, handlers } = useTilt({
    max: flat ? 0 : 3,
    scale,
    disabled,
  })

  const sheen = useMotionTemplate`linear-gradient(105deg, transparent calc(${glareX} - 14%), rgba(255,255,255,0.1) ${glareX}, transparent calc(${glareX} + 14%))`

  return (
    <motion.div
      ref={ref}
      {...(disabled ? {} : handlers)}
      style={
        disabled
          ? undefined
          : {
              rotateX: flat ? 0 : rotateX,
              rotateY: flat ? 0 : rotateY,
              scale: scaleValue,
              transformPerspective: 700,
            }
      }
      className={cn('metric-tile group relative overflow-hidden rounded-xl', className)}
    >
      {!disabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: sheen }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
