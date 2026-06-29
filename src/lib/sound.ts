/**
 * Tiny Web Audio synth — produces soft futuristic UI sounds without any asset files.
 * All sounds are muted by default and only play when the user enables sound.
 */
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtor) return null
    ctx = new AudioCtor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, duration: number, type: OscillatorType, gain: number, delay = 0) {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  const t0 = ac.currentTime + delay
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export const sfx = {
  click() {
    tone(660, 0.08, 'triangle', 0.05)
    tone(990, 0.06, 'sine', 0.03, 0.02)
  },
  transmit() {
    tone(420, 0.12, 'sawtooth', 0.03)
    tone(620, 0.12, 'sine', 0.025, 0.06)
    tone(880, 0.16, 'sine', 0.02, 0.12)
  },
  success() {
    tone(523, 0.1, 'sine', 0.04)
    tone(659, 0.1, 'sine', 0.04, 0.08)
    tone(784, 0.18, 'sine', 0.04, 0.16)
  },
}

export type SfxName = keyof typeof sfx
