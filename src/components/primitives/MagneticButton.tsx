import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  className?: string
  type?: 'button' | 'submit'
  ariaLabel?: string
  disabled?: boolean
}

const VARIANTS: Record<NonNullable<MagneticButtonProps['variant']>, string> = {
  primary:
    'text-white bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-[length:200%_auto] hover:bg-[position:right_center] shadow-glow',
  ghost: 'text-ink-muted hover:text-ink bg-white/5 hover:bg-white/10 border border-white/10',
  outline: 'text-ink glow-border bg-surface/60 hover:bg-surface',
}

export function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className,
  type = 'button',
  ariaLabel,
  disabled,
}: MagneticButtonProps) {
  const { reducedMotion, play } = useSettings()

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      whileHover={reducedMotion || disabled ? undefined : { scale: 1.05 }}
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
      onClick={() => {
        play('click')
        onClick?.()
      }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold',
        'transition-colors duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </motion.button>
  )
}
