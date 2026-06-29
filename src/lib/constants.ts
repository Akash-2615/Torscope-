import type { Country } from './types'

/** The user's fixed origin country for all circuit visualizations. */
export const USER_COUNTRY: Country = {
  code: 'IN',
  name: 'India',
  flag: '🇮🇳',
  lat: 22,
  lng: 79,
}

/** The fixed destination country for circuit visualizations. */
export const SITE_COUNTRY: Country = {
  code: 'US',
  name: 'United States',
  flag: '🇺🇸',
  lat: 38,
  lng: -97,
}

/** @deprecated use USER_COUNTRY */
export const USER_GEO = { lat: USER_COUNTRY.lat, lng: USER_COUNTRY.lng }

/** @deprecated use SITE_COUNTRY */
export const SITE_GEO = { lat: SITE_COUNTRY.lat, lng: SITE_COUNTRY.lng }
