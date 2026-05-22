let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setMuted(value: boolean): void { muted = value }
export function getMuted(): boolean { return muted }

export function playMove(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const osc = c.createOscillator()
  const gain = c.createGain()
  const filter = c.createBiquadFilter()

  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(800, t)
  filter.frequency.exponentialRampToValueAtTime(200, t + 0.08)
  filter.Q.value = 0.8

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(180, t)
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.08)

  gain.gain.setValueAtTime(0.18, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)

  osc.start(t)
  osc.stop(t + 0.08)
}

export function playTurn(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, t)
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.06)
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.12)

  gain.gain.setValueAtTime(0.12, t)
  gain.gain.setValueAtTime(0.12, t + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

  osc.connect(gain)
  gain.connect(c.destination)

  osc.start(t)
  osc.stop(t + 0.12)
}

export function playWin(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const notes = [523.25, 659.25, 783.99, 1046.5]
  const delays = [0, 0.12, 0.24, 0.38]

  notes.forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    const start = t + delays[i]

    osc.type = 'triangle'
    osc.frequency.value = freq

    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.2, start + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)

    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(start)
    osc.stop(start + 0.4)
  })
}

export function playClick(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const osc = c.createOscillator()
  const gain = c.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1100, t)
  osc.frequency.exponentialRampToValueAtTime(700, t + 0.05)

  gain.gain.setValueAtTime(0.1, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)

  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.05)
}

export function playFail(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const osc = c.createOscillator()
  const osc2 = c.createOscillator()
  const gain = c.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(320, t)
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.35)

  osc2.type = 'square'
  osc2.frequency.setValueAtTime(310, t)
  osc2.frequency.exponentialRampToValueAtTime(75, t + 0.35)

  gain.gain.setValueAtTime(0.15, t)
  gain.gain.setValueAtTime(0.15, t + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(c.destination)

  osc.start(t)
  osc.stop(t + 0.4)
  osc2.start(t)
  osc2.stop(t + 0.4)
}
