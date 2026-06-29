import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

/** Pause/resume the global Lenis smooth-scroll instance (e.g. while a modal is open). */
export function setScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop()
    else lenisInstance.start()
  }
  // Also lock native scrolling for the reduced-motion (no-Lenis) case.
  document.body.style.overflow = locked ? 'hidden' : ''
}

/** Initialise Lenis smooth scrolling. Disabled when reduced motion is requested. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisInstance = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}
