import type { Circuit, Relay, RelayRole } from './types'
import { COUNTRIES } from './geo'
import { mulberry32, pick, randFloat, randInt } from './random'
import { randomIpForRegion } from './ip'

const NICK_PREFIX = [
  'tor', 'onion', 'relay', 'node', 'priv', 'anon', 'guard', 'cipher', 'shadow', 'aegis',
  'haven', 'nimbus', 'vortex', 'photon', 'quantum', 'helix', 'orbit', 'spectre', 'lumen', 'cobalt',
]
const NICK_SUFFIX = [
  'exit', 'relay', 'fast', 'core', 'edge', 'net', 'sec', 'one', 'prime', 'hub', 'link', 'way', 'gate',
]

const AS_POOL = [
  ['AS24940', 'Hetzner Online'],
  ['AS16276', 'OVH SAS'],
  ['AS14061', 'DigitalOcean'],
  ['AS3320', 'Deutsche Telekom'],
  ['AS9009', 'M247 Europe'],
  ['AS60781', 'LeaseWeb'],
  ['AS51167', 'Contabo'],
  ['AS396982', 'Google Cloud'],
  ['AS13335', 'Cloudflare'],
  ['AS20473', 'Vultr'],
]

const ROLE_FLAGS: Record<RelayRole, string[]> = {
  guard: ['Guard', 'Stable', 'Fast', 'Running', 'V2Dir'],
  middle: ['Stable', 'Fast', 'Running', 'Valid'],
  exit: ['Exit', 'Stable', 'Fast', 'Running'],
}

function makeNickname(rng: () => number): string {
  return `${pick(NICK_PREFIX, rng)}${pick(NICK_SUFFIX, rng)}${randInt(1, 99, rng)}`
}

function makeRelay(role: RelayRole, rng: () => number): Relay {
  const country = pick(COUNTRIES, rng)
  const [asn, asName] = pick(AS_POOL, rng)
  // jitter coordinates so relays in the same country spread out a little
  const lat = country.lat + randFloat(-6, 6, rng)
  const lng = country.lng + randFloat(-8, 8, rng)
  const flagPool = ROLE_FLAGS[role]
  const flags = flagPool.filter(() => rng() > 0.35)
  if (flags.length === 0) flags.push(flagPool[0])
  return {
    id: `${role}-${Math.floor(rng() * 1e9).toString(36)}`,
    nickname: makeNickname(rng),
    role,
    country,
    lat,
    lng,
    bandwidthMbps: Math.round(randFloat(8, 480, rng)),
    latencyMs: Math.round(randFloat(18, 180, rng)),
    asn,
    asName,
    flags,
    ip: randomIpForRegion(country.code, rng),
  }
}

const ROLE_WEIGHTS: RelayRole[] = [
  'guard', 'guard', 'guard',
  'middle', 'middle', 'middle', 'middle', 'middle',
  'exit', 'exit',
]

/** Generate a reproducible pool of relays for map / clustering visualizations. */
export function generateRelays(count: number, seed = 1337): Relay[] {
  const rng = mulberry32(seed)
  const relays: Relay[] = []
  for (let i = 0; i < count; i++) {
    const role = pick(ROLE_WEIGHTS, rng)
    relays.push(makeRelay(role, rng))
  }
  return relays
}

/** Select a fresh random circuit: distinct guard, middle and exit (different countries when possible). */
export function pickCircuit(seed = Date.now()): Circuit {
  const rng = mulberry32(seed)
  const guard = makeRelay('guard', rng)
  let middle = makeRelay('middle', rng)
  let safety = 0
  while (middle.country.code === guard.country.code && safety++ < 8) {
    middle = makeRelay('middle', rng)
  }
  let exit = makeRelay('exit', rng)
  safety = 0
  while (
    (exit.country.code === guard.country.code || exit.country.code === middle.country.code) &&
    safety++ < 12
  ) {
    exit = makeRelay('exit', rng)
  }
  return { id: `circuit-${seed.toString(36)}`, guard, middle, exit, createdAt: seed }
}

export const ROLE_COLORS: Record<RelayRole, string> = {
  guard: '#34D399',
  middle: '#A78BFA',
  exit: '#F87171',
}

export const ROLE_LABEL: Record<RelayRole, string> = {
  guard: 'Guard / Entry',
  middle: 'Middle',
  exit: 'Exit',
}
