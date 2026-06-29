import { COUNTRIES } from './geo'
import type { Country } from './types'
import { SITE_COUNTRY } from './constants'

export interface SiteDestination {
  brand: string
  domain: string
  country: Country
}

export interface DestinationPreset {
  id: string
  brand: string
  domain: string
  countryCode: string
}

/** Educational destination presets — each brand's server region is fixed by the
 * company (illustrative locations), exactly like real life where the user only
 * picks the site, not where it is hosted. */
export const DESTINATION_PRESETS: DestinationPreset[] = [
  { id: 'google', brand: 'Google', domain: 'google.com', countryCode: 'US' },
  { id: 'wikipedia', brand: 'Wikipedia', domain: 'wikipedia.org', countryCode: 'US' },
  { id: 'github', brand: 'GitHub', domain: 'github.com', countryCode: 'US' },
  { id: 'bbc', brand: 'BBC', domain: 'bbc.co.uk', countryCode: 'GB' },
  { id: 'spotify', brand: 'Spotify', domain: 'spotify.com', countryCode: 'SE' },
  { id: 'proton', brand: 'Proton', domain: 'proton.me', countryCode: 'CH' },
  { id: 'lemonde', brand: 'Le Monde', domain: 'lemonde.fr', countryCode: 'FR' },
  { id: 'debian', brand: 'Debian', domain: 'debian.org', countryCode: 'DE' },
  { id: 'wikimedia', brand: 'Wikimedia', domain: 'wikimedia.org', countryCode: 'NL' },
  { id: 'cbc', brand: 'CBC', domain: 'cbc.ca', countryCode: 'CA' },
]

export const DEFAULT_DESTINATION: SiteDestination = {
  brand: 'Google',
  domain: 'google.com',
  country: SITE_COUNTRY,
}

export function countryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? SITE_COUNTRY
}

/** Full HTTPS URL for a destination domain. */
export function siteHref(domain: string): string {
  return `https://${domain}`
}

/** Local brand icon path for a preset id. */
export function brandIconPath(presetId: string): string {
  return `/brands/${presetId}.svg`
}

/** Resolve icon path from preset id or matching domain. */
export function iconForDestination(
  destination: SiteDestination,
  presetId: string | null,
): string {
  if (presetId) return brandIconPath(presetId)
  const preset = DESTINATION_PRESETS.find((p) => p.domain === destination.domain)
  return preset ? brandIconPath(preset.id) : '/brands/default.svg'
}

export function presetToDestination(preset: DestinationPreset): SiteDestination {
  return {
    brand: preset.brand,
    domain: preset.domain,
    country: countryByCode(preset.countryCode),
  }
}

export function destinationFromStorage(raw: string | null): SiteDestination | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<SiteDestination> & { presetId?: string }
    if (data.presetId) {
      const preset = DESTINATION_PRESETS.find((p) => p.id === data.presetId)
      if (preset) return presetToDestination(preset)
    }
    if (data.brand && data.domain && data.country?.code) {
      const country = countryByCode(data.country.code)
      return { brand: data.brand, domain: data.domain, country }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null
}
