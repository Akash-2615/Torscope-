import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useSettings } from '@/context/SettingsContext'

interface AnimatedIpProps {
  ip: string
  className?: string
}

/** Scrambles digits briefly whenever the IP changes, then settles on the real value. */
export function AnimatedIp({ ip, className }: AnimatedIpProps) {
  const { reducedMotion } = useSettings()
  const [display, setDisplay] = useState(ip)
  const prev = useRef(ip)

  useEffect(() => {
    if (prev.current === ip) return
    prev.current = ip
    if (reducedMotion) {
      setDisplay(ip)
      return
    }
    let frame = 0
    const total = 16
    const id = window.setInterval(() => {
      frame++
      if (frame >= total) {
        setDisplay(ip)
        window.clearInterval(id)
        return
      }
      const scrambled = ip
        .split('')
        .map((ch) => (ch === '.' ? '.' : Math.floor(Math.random() * 10).toString()))
        .join('')
      setDisplay(scrambled)
    }, 35)
    return () => window.clearInterval(id)
  }, [ip, reducedMotion])

  return <span className={cn('font-mono tabular-nums', className)}>{display}</span>
}
