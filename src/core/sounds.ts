let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setMuted(value: boolean): void { 
  muted = value 
  updateBackgroundMusicVolume()
}
export function getMuted(): boolean { return muted }

let thrusterNodes: { noise: AudioBufferSourceNode; gain: GainNode } | null = null

export function startThruster(): void {
  if (muted || thrusterNodes) return
  const c = getCtx()
  const t = c.currentTime

  const bufLen = Math.ceil(c.sampleRate * 0.6)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

  const noise = c.createBufferSource()
  noise.buffer = buf
  noise.loop = true

  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 220
  bp.Q.value = 1.2

  const gain = c.createGain()
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.22, t + 0.08)

  noise.connect(bp)
  bp.connect(gain)
  gain.connect(c.destination)

  noise.start(t)
  thrusterNodes = { noise, gain }
}

export function stopThruster(): void {
  if (!thrusterNodes) return
  const c = getCtx()
  const t = c.currentTime
  const { noise, gain } = thrusterNodes
  thrusterNodes = null

  gain.gain.setValueAtTime(gain.gain.value, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  setTimeout(() => { try { noise.stop() } catch { /* already stopped */ } }, 160)
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

// Pairs of [start, end] frequencies — glide between musical intervals
const BIPP_GLIDES: [number, number][] = [
  [660, 880], [880, 660], [550, 770], [770, 550],
  [660, 990], [550, 880], [770, 660], [880, 550],
]
let bippSpeakPhase = 0

export function playBippSpeak(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime
  const [f1, f2] = BIPP_GLIDES[bippSpeakPhase % BIPP_GLIDES.length]
  bippSpeakPhase++

  const osc = c.createOscillator()
  const filter = c.createBiquadFilter()
  const gain = c.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(f1, t)
  osc.frequency.exponentialRampToValueAtTime(f2, t + 0.09)

  filter.type = 'lowpass'
  filter.frequency.value = 1800
  filter.Q.value = 0.7

  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.09, t + 0.007)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.14)
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

// Удар при посадке: глубокий удар + суббас
export function playLanding(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const bufLen = Math.ceil(c.sampleRate * 0.6)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

  const noise = c.createBufferSource()
  noise.buffer = buf

  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 110

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0, t)
  noiseGain.gain.linearRampToValueAtTime(0.65, t + 0.012)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)

  noise.connect(lp)
  lp.connect(noiseGain)
  noiseGain.connect(c.destination)
  noise.start(t)
  noise.stop(t + 0.6)

  // Суббас
  const sub = c.createOscillator()
  const subGain = c.createGain()
  sub.type = 'sine'
  sub.frequency.setValueAtTime(52, t)
  sub.frequency.exponentialRampToValueAtTime(28, t + 0.35)
  subGain.gain.setValueAtTime(0, t)
  subGain.gain.linearRampToValueAtTime(0.28, t + 0.01)
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
  sub.connect(subGain)
  subGain.connect(c.destination)
  sub.start(t)
  sub.stop(t + 0.6)
}

// Торжественный аккорд — d-мол ступенями, как в космооперах
export function playArrival(): void {
  if (muted) return
  const c = getCtx()
  const t = c.currentTime

  const notes =  [146.83, 220.00, 349.23, 587.33]
  const offsets = [0,      0.28,   0.56,   0.90  ]
  const dur = 4.5

  notes.forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    const s = t + offsets[i]

    osc.type = 'triangle'
    osc.frequency.value = freq

    gain.gain.setValueAtTime(0, s)
    gain.gain.linearRampToValueAtTime(0.11, s + 0.18)
    gain.gain.setValueAtTime(0.11, s + dur * 0.55)
    gain.gain.exponentialRampToValueAtTime(0.001, s + dur)

    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(s)
    osc.stop(s + dur + 0.1)
  })
}

// ─── Фоновая музыка ─────────────────────────────────────────
let bgmAudio: HTMLAudioElement | null = null
const volume = 0.08

export function initBackgroundMusic(): void {
  if (bgmAudio) return
  
  bgmAudio = new Audio('/sound/background_music.mp3')
  bgmAudio.loop = true
  bgmAudio.volume = volume // Тихо чтобы не перекрывать звуки игры
}

export function playBackgroundMusic(): void {
  if (!bgmAudio) initBackgroundMusic()
  if (!bgmAudio) return
  
  if (muted) {
    bgmAudio.volume = 0
  } else {
    bgmAudio.volume = volume
  }
  
  if (bgmAudio.paused) {
    bgmAudio.currentTime = 0
    bgmAudio.play().catch(() => {})
  }
}

export function stopBackgroundMusic(): void {
  if (!bgmAudio) return
  bgmAudio.pause()
  bgmAudio.currentTime = 0
}

export function updateBackgroundMusicVolume(): void {
  if (!bgmAudio) return
  bgmAudio.volume = muted ? 0 : volume
}
