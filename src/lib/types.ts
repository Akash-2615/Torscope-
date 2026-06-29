export type RelayRole = 'guard' | 'middle' | 'exit'

export interface Country {
  code: string
  name: string
  flag: string
  lat: number
  lng: number
}

export interface Relay {
  id: string
  nickname: string
  role: RelayRole
  country: Country
  lat: number
  lng: number
  bandwidthMbps: number
  latencyMs: number
  asn: string
  asName: string
  flags: string[]
  ip: string
}

export interface Circuit {
  id: string
  guard: Relay
  middle: Relay
  exit: Relay
  createdAt: number
}
