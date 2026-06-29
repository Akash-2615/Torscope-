import { randInt } from './random'

/** Public-looking IPv4 ranges loosely associated with each region (illustrative only). */
const REGION_PREFIXES: Record<string, number[]> = {
  US: [104, 23, 198],
  DE: [185, 88, 78],
  NL: [185, 51, 145],
  FR: [51, 91, 163],
  JP: [133, 153, 210],
  SG: [128, 199, 159],
  IN: [223, 196, 103],
  CA: [142, 44, 192],
  SE: [193, 11, 46],
  CH: [185, 220, 101],
  GB: [51, 89, 178],
  FI: [95, 217, 88],
  AU: [203, 0, 134],
  BR: [177, 54, 200],
  RO: [188, 215, 79],
}

export function randomIpForRegion(code: string, rng: () => number): string {
  const prefixes = REGION_PREFIXES[code] ?? [185]
  const first = prefixes[Math.floor(rng() * prefixes.length)]
  return `${first}.${randInt(0, 255, rng)}.${randInt(0, 255, rng)}.${randInt(1, 254, rng)}`
}

/** Format an IP with the leading octet visible and the rest masked. */
export function maskIp(ip: string): string {
  const parts = ip.split('.')
  return `${parts[0]}.xxx.xxx.xxx`
}
