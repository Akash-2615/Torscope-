import { useEffect, useRef, useState } from 'react'

/** Returns a ref and whether the element is currently within (or near) the viewport. */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '200px',
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
