import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { sfx } from '@/lib/sound'
import type { SfxName } from '@/lib/sound'

interface SettingsValue {
  soundOn: boolean
  toggleSound: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  play: (name: SfxName) => void
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const systemReduced = usePrefersReducedMotion()
  const [soundOn, setSoundOn] = useState(false)
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null)

  const reducedMotion = motionOverride ?? systemReduced

  const play = useCallback(
    (name: SfxName) => {
      if (soundOn) sfx[name]()
    },
    [soundOn],
  )

  const value = useMemo<SettingsValue>(
    () => ({
      soundOn,
      toggleSound: () => setSoundOn((s) => !s),
      reducedMotion,
      toggleReducedMotion: () => setMotionOverride((m) => !(m ?? systemReduced)),
      play,
    }),
    [soundOn, reducedMotion, systemReduced, play],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
