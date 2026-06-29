import { useCallback, useRef, useState } from 'react'
import { pickCircuit } from '@/lib/relays'
import type { Circuit } from '@/lib/types'

interface UseCircuit {
  circuit: Circuit
  previous: Circuit | null
  generation: number
  regenerate: () => void
}

/** Manages the active Tor circuit and remembers the previous one for "new identity" comparisons. */
export function useCircuit(initialSeed?: number): UseCircuit {
  const seedRef = useRef(initialSeed ?? Math.floor(Math.random() * 1e9))
  const [circuit, setCircuit] = useState<Circuit>(() => pickCircuit(seedRef.current))
  const [previous, setPrevious] = useState<Circuit | null>(null)
  const [generation, setGeneration] = useState(0)

  const regenerate = useCallback(() => {
    setCircuit((current) => {
      setPrevious(current)
      seedRef.current = Math.floor(Math.random() * 1e9)
      return pickCircuit(seedRef.current)
    })
    setGeneration((g) => g + 1)
  }, [])

  return { circuit, previous, generation, regenerate }
}
