import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { useSettings } from '@/context/SettingsContext'

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  className?: string
  format?: (n: number) => string
}

export function AnimatedNumber({
  value,
  duration = 1.2,
  decimals = 0,
  className,
  format,
}: AnimatedNumberProps) {
  const { reducedMotion } = useSettings()
  const [display, setDisplay] = useState(reducedMotion ? value : 0)

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value)
      return
    }
    const controls = animate(display, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion])

  const text = format
    ? format(display)
    : display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

  return <span className={`tabular-nums ${className ?? ''}`}>{text}</span>
}
