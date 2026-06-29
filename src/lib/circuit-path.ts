import type { Circuit, Country, Relay } from './types'
import { ROLE_COLORS, ROLE_LABEL } from './relays'
import { USER_COUNTRY } from './constants'
import type { SiteDestination } from './destinations'
import { DEFAULT_DESTINATION } from './destinations'

export interface CircuitHop {
  lat: number
  lng: number
  color: string
  label: string
  country: string
  flag: string
  role?: string
}

export interface CircuitPathStep {
  id: string
  title: string
  country: Country
  color: string
  role?: string
  domain?: string
  relay?: Relay
  ip?: string
  latencyMs?: number
  bandwidthMbps?: number
  flags?: string[]
}

/** Build globe arc hops with country metadata for each node. */
export function buildCircuitHops(
  circuit: Circuit,
  user: Country = USER_COUNTRY,
  site: SiteDestination = DEFAULT_DESTINATION,
): CircuitHop[] {
  return [
    {
      lat: user.lat,
      lng: user.lng,
      color: '#22d3ee',
      label: 'You',
      country: user.name,
      flag: user.flag,
      role: 'user',
    },
    hopFromRelay(circuit.guard, 'Guard'),
    hopFromRelay(circuit.middle, 'Middle'),
    hopFromRelay(circuit.exit, 'Exit'),
    {
      lat: site.country.lat,
      lng: site.country.lng,
      color: '#60a5fa',
      label: site.brand,
      country: site.country.name,
      flag: site.country.flag,
      role: 'site',
    },
  ]
}

function hopFromRelay(relay: Relay, shortRole: string): CircuitHop {
  return {
    lat: relay.lat,
    lng: relay.lng,
    color: ROLE_COLORS[relay.role],
    label: relay.nickname,
    country: relay.country.name,
    flag: relay.country.flag,
    role: shortRole,
  }
}

/** Build the sidebar "Active Circuit" steps shown next to the globe. */
export function buildCircuitPath(
  circuit: Circuit,
  user: Country = USER_COUNTRY,
  site: SiteDestination = DEFAULT_DESTINATION,
): CircuitPathStep[] {
  return [
    {
      id: 'user',
      title: 'You',
      country: user,
      color: '#22d3ee',
      ip: USER_REAL_IP,
    },
    relayStep(circuit.guard),
    relayStep(circuit.middle),
    relayStep(circuit.exit),
    {
      id: 'site',
      title: site.brand,
      country: site.country,
      color: '#60a5fa',
      role: 'Destination',
      domain: site.domain,
      ip: circuit.exit.ip,
    },
  ]
}

/** The user's fixed real (pre-Tor) source IP. */
export const USER_REAL_IP = '223.184.45.102'

export interface IpFlowStep {
  id: string
  /** Short node name shown in the flowchart. */
  label: string
  /** Educational role tag. */
  role: string
  flag: string
  country: string
  color: string
  /** The source IP that the *next* hop sees coming from this node. */
  outIp: string
  /** Plain-language note on what this hop reveals. */
  note: string
  kind: 'user' | 'guard' | 'middle' | 'exit' | 'site'
}

/**
 * Build the IP-transition flowchart steps. Each Tor hop rewrites the source
 * IP, so the website only ever sees the Exit relay's IP — never the user's.
 */
export function buildIpFlow(
  circuit: Circuit,
  user: Country = USER_COUNTRY,
  site: SiteDestination = DEFAULT_DESTINATION,
): IpFlowStep[] {
  return [
    {
      id: 'user',
      label: 'You',
      role: 'Origin',
      flag: user.flag,
      country: user.name,
      color: '#22d3ee',
      outIp: USER_REAL_IP,
      note: 'Your real IP leaves your device — encrypted in 3 layers.',
      kind: 'user',
    },
    {
      id: 'guard',
      label: 'Guard',
      role: 'Entry relay',
      flag: circuit.guard.country.flag,
      country: circuit.guard.country.name,
      color: ROLE_COLORS.guard,
      outIp: circuit.guard.ip,
      note: 'Sees your real IP, but not the destination. Peels layer 1.',
      kind: 'guard',
    },
    {
      id: 'middle',
      label: 'Middle',
      role: 'Relay',
      flag: circuit.middle.country.flag,
      country: circuit.middle.country.name,
      color: ROLE_COLORS.middle,
      outIp: circuit.middle.ip,
      note: 'Sees only the Guard IP. Knows neither you nor the site. Peels layer 2.',
      kind: 'middle',
    },
    {
      id: 'exit',
      label: 'Exit',
      role: 'Exit relay',
      flag: circuit.exit.country.flag,
      country: circuit.exit.country.name,
      color: ROLE_COLORS.exit,
      outIp: circuit.exit.ip,
      note: 'Sees the Middle IP and the destination. Peels the last layer.',
      kind: 'exit',
    },
    {
      id: 'site',
      label: site.brand,
      role: 'Destination',
      flag: site.country.flag,
      country: site.country.name,
      color: '#60a5fa',
      outIp: circuit.exit.ip,
      note: `${site.brand} logs the Exit IP (${circuit.exit.ip}) — your real IP stays hidden.`,
      kind: 'site',
    },
  ]
}

function relayStep(relay: Relay): CircuitPathStep {
  return {
    id: relay.id,
    title: relay.nickname,
    country: relay.country,
    color: ROLE_COLORS[relay.role],
    role: ROLE_LABEL[relay.role],
    relay,
    ip: relay.ip,
    latencyMs: relay.latencyMs,
    bandwidthMbps: relay.bandwidthMbps,
    flags: relay.flags,
  }
}
