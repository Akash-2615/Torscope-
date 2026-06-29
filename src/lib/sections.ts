export interface NavSection {
  id: string
  label: string
  /** show in the top navigation (a curated subset) */
  primary?: boolean
}

export const SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Home' },
  { id: 'layers', label: 'Web Layers', primary: true },
  { id: 'internet', label: 'The Internet' },
  { id: 'how-tor', label: 'How Tor Works', primary: true },
  { id: 'guard', label: 'Guard Relay' },
  { id: 'middle', label: 'Middle Relay' },
  { id: 'exit', label: 'Exit Relay' },
  { id: 'new-identity', label: 'New Identity', primary: true },
  { id: 'tormap', label: 'Live TorMap', primary: true },
  { id: 'onion', label: 'Onion Routing' },
  { id: 'who-knows', label: 'Who Knows What' },
  { id: 'why-slow', label: 'Why Slow' },
  { id: 'advantages', label: 'Advantages' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'demo', label: 'Demo Mode', primary: true },
  { id: 'summary', label: 'Summary' },
]
