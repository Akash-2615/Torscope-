import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_DESTINATION,
  DESTINATION_PRESETS,
  destinationFromStorage,
  presetToDestination,
  countryByCode,
  type SiteDestination,
} from '@/lib/destinations'
import type { Country } from '@/lib/types'

const STORAGE_KEY = 'torscope-destination'

interface DestinationValue {
  destination: SiteDestination
  presetId: string | null
  setPreset: (id: string) => void
  setCountry: (countryOrCode: Country | string) => void
  setBrand: (brand: string, domain: string) => void
}

const DestinationContext = createContext<DestinationValue | null>(null)

function loadInitial(): { destination: SiteDestination; presetId: string | null } {
  if (typeof window === 'undefined') {
    return { destination: DEFAULT_DESTINATION, presetId: 'google' }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { destination: DEFAULT_DESTINATION, presetId: 'google' }
    const data = JSON.parse(raw) as Partial<SiteDestination> & { presetId?: string | null }
    if (data.presetId) {
      const preset = DESTINATION_PRESETS.find((p) => p.id === data.presetId)
      if (preset) return { destination: presetToDestination(preset), presetId: data.presetId }
    }
    const stored = destinationFromStorage(raw)
    if (stored) return { destination: stored, presetId: data.presetId ?? null }
  } catch {
    /* ignore */
  }
  return { destination: DEFAULT_DESTINATION, presetId: 'google' }
}

function persist(destination: SiteDestination, presetId: string | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...destination, presetId }))
  } catch {
    /* quota / private mode */
  }
}

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadInitial)

  const setPreset = useCallback((id: string) => {
    const preset = DESTINATION_PRESETS.find((p) => p.id === id)
    if (!preset) return
    const destination = presetToDestination(preset)
    setState({ destination, presetId: id })
    persist(destination, id)
  }, [])

  const setCountry = useCallback((country: Country) => {
    setState((prev) => {
      const destination = { ...prev.destination, country }
      persist(destination, null)
      return { destination, presetId: null }
    })
  }, [])

  const setBrand = useCallback((brand: string, domain: string) => {
    setState((prev) => {
      const destination = { ...prev.destination, brand, domain }
      persist(destination, null)
      return { destination, presetId: null }
    })
  }, [])

  const value = useMemo<DestinationValue>(
    () => ({
      destination: state.destination,
      presetId: state.presetId,
      setPreset,
      setCountry: (countryOrCode: Country | string) => {
        const country =
          typeof countryOrCode === 'string' ? countryByCode(countryOrCode) : countryOrCode
        setCountry(country)
      },
      setBrand,
    }),
    [state, setPreset, setCountry, setBrand],
  )

  return <DestinationContext.Provider value={value}>{children}</DestinationContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDestination(): DestinationValue {
  const ctx = useContext(DestinationContext)
  if (!ctx) throw new Error('useDestination must be used within DestinationProvider')
  return ctx
}
