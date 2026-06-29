import type { ReactNode } from 'react'
import { motion, useMotionTemplate } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'
import { useTilt } from '@/hooks/useTilt'

interface GlowCardProps {
  children: ReactNode
  className?: string
  /** Adds a moving spotlight/glare that follows the cursor. */
  spotlight?: boolean
  /** 3D tilt + magnify on hover (liquid glass). Disable for cards wrapping a 3D canvas. */
  tilt?: boolean
  /** how much to magnify on hover */
  magnify?: number
}

export function GlowCard({
  children,
  className,
  spotlight = true,
  tilt = true,
  magnify = 1.012,
}: GlowCardProps) {
  const { reducedMotion } = useSettings()
  const disabled = reducedMotion || !tilt
  const { ref, rotateX, rotateY, scale, glareX, handlers } = useTilt({
    max: 3.5,
    scale: magnify,
    disabled,
  })

  // faint diagonal specular streak that tracks the cursor (surface highlight only)
  const streak = useMotionTemplate`linear-gradient(105deg, transparent calc(${glareX} - 12%), rgba(255,255,255,0.12) ${glareX}, transparent calc(${glareX} + 12%))`

  return (
    <motion.div
      ref={ref}
      {...(disabled ? {} : handlers)}
      style={disabled ? undefined : { rotateX, rotateY, scale, transformPerspective: 1100 }}
      className={cn(
        'liquid-glass glow-border group relative overflow-hidden rounded-2xl',
        className,
      )}
    >
      {/* subtle moving specular streak */}
      {spotlight && !disabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: streak }}
        />
      )}
      {/* top sheen line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}
