import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { playBippSpeak } from '../core/sounds'
import type { ComponentType } from 'react'

interface Props {
  levelId: number
  title: string
  text: string
  onClose: () => void
  instant?: boolean
  HintPanel?: ComponentType<{ autoPlay?: boolean }>
}

const CHAR_DELAY = 20
const BEEP_EVERY = 7

function BippLarge({ speaking }: { speaking: boolean }) {
  return (
    <svg width="120" height="140" viewBox="0 0 48 56" fill="none">
      <rect x="22" y="3" width="3" height="11" rx="1.5" fill="#475569"/>
      <motion.circle
        cx="23.5" cy="3" r="4.5" fill="#fbbf24"
        animate={{ opacity: speaking ? [0.3, 1, 0.3] : [0.35, 1, 0.35] }}
        transition={{ duration: speaking ? 0.35 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="23.5" cy="3" r="2.5" fill="#fef08a" opacity="0.9"/>
      <rect x="5" y="13" width="38" height="28" rx="6" fill="#1e293b"/>
      <rect x="5" y="13" width="38" height="28" rx="6" fill="none" stroke="#334155" strokeWidth="1.5"/>
      <rect x="9" y="17" width="30" height="20" rx="3.5" fill="#0f172a"/>
      <motion.g
        animate={{ opacity: [1, 1, 0.05, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1], delay: 0.8 }}
      >
        <circle cx="18" cy="25" r="4.5" fill="#1e40af"/>
        <circle cx="18" cy="25" r="2.8" fill="#3b82f6"/>
        <circle cx="18" cy="25" r="1.4" fill="#bae6fd"/>
        <circle cx="16.8" cy="23.8" r="0.8" fill="white" opacity="0.7"/>
      </motion.g>
      <motion.g
        animate={{ opacity: [1, 1, 0.05, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.44, 0.5, 0.56, 1], delay: 0.9 }}
      >
        <circle cx="30" cy="25" r="4.5" fill="#1e40af"/>
        <circle cx="30" cy="25" r="2.8" fill="#3b82f6"/>
        <circle cx="30" cy="25" r="1.4" fill="#bae6fd"/>
        <circle cx="28.8" cy="23.8" r="0.8" fill="white" opacity="0.7"/>
      </motion.g>
      <rect x="15" y="31" width="18" height="4.5" rx="1.5" fill="#0f172a"/>
      {speaking ? (
        [18, 21, 24, 27, 30].map((x, i) => (
          <motion.line
            key={x}
            x1={x} x2={x}
            animate={{
              y1: [31.5, 31.5 + (i % 3) * 1.2, 31.5],
              y2: [35, 35 - (i % 3) * 1.2, 35],
            }}
            transition={{ duration: 0.18 + i * 0.04, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
            stroke="#3b82f6"
            strokeWidth="1.2"
          />
        ))
      ) : (
        [18, 21, 24, 27, 30].map(x => (
          <line key={x} x1={x} y1="31" x2={x} y2="35.5" stroke="#1e293b" strokeWidth="1.2"/>
        ))
      )}
      <rect x="1" y="19" width="4" height="10" rx="2" fill="#334155"/>
      <rect x="43" y="19" width="4" height="10" rx="2" fill="#334155"/>
      <motion.circle
        cx="3" cy="24" r="1.8" fill="#22c55e"
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: speaking ? 0.3 : 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      <rect x="15" y="41" width="18" height="10" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
      <rect x="18" y="44" width="5" height="3" rx="1" fill="#334155"/>
      <rect x="25" y="44" width="5" height="3" rx="1" fill="#334155"/>
      <rect x="9" y="38" width="30" height="2.5" rx="1.2" fill="#3b82f6" opacity={speaking ? 0.7 : 0.3}/>
    </svg>
  )
}

export function BippBriefing({ levelId, title, text, onClose, instant = false, HintPanel }: Props) {
  const [visibleChars, setVisibleChars] = useState(() => instant ? text.length : 0)
  const done = visibleChars >= text.length
  const idxRef = useRef(instant ? text.length : 0)
  const beepRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (instant) return

    idxRef.current = 0
    beepRef.current = 0
    setVisibleChars(0)

    timerRef.current = setInterval(() => {
      if (idxRef.current >= text.length) {
        clearInterval(timerRef.current!)
        timerRef.current = null
        setVisibleChars(text.length)
        return
      }
      idxRef.current++
      const ch = text[idxRef.current - 1]
      setVisibleChars(idxRef.current)
      if (ch !== '\n' && ch !== ' ') {
        beepRef.current++
        if (beepRef.current >= BEEP_EVERY) {
          beepRef.current = 0
          playBippSpeak()
        }
      }
    }, CHAR_DELAY)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text])

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight
    }
  }, [visibleChars])

  function skipOrClose() {
    if (!done) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
      idxRef.current = text.length
      setVisibleChars(text.length)
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,6,0.85)' }}
      onClick={skipOrClose}
    >
      <motion.div
        className="bg-indigo-950 border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col gap-5 p-8 overflow-y-auto"
        style={{
          width: 'min(640px, calc(100vw - 48px))',
          maxHeight: 'calc(100vh - 48px)',
          boxShadow: '0 0 60px rgba(99,102,241,0.25), 0 25px 50px rgba(0,0,0,0.6)',
        }}
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center">
          <p
            className="text-xs text-blue-400 tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            ◈ Брифинг БИПП ◈
          </p>
          <h2
            className="text-yellow-400 font-bold text-2xl"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Сектор {levelId} — {title}
          </h2>
        </div>

        {/* Big BIPP */}
        <div className="flex justify-center">
          <BippLarge speaking={!done} />
        </div>

        {/* Text */}
        <div
          ref={textRef}
          className="rounded-xl bg-indigo-900/40 border border-indigo-700/40 px-5 py-4 text-indigo-100 leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '1rem' }}
        >
          {text.slice(0, visibleChars)}
          {!done && (
            <motion.span
              className="inline-block text-yellow-400"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >▍</motion.span>
          )}
        </div>

        {/* Анимация команды */}
        {HintPanel && <HintPanel />}

        {/* Button */}
        <button
          onClick={skipOrClose}
          className="w-full py-3 rounded-xl font-bold text-base transition-colors bg-yellow-400 text-indigo-950 hover:bg-yellow-300"
          style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}
        >
          {done ? '✓ ПОНЯЛ, ПРИСТУПАЮ!' : 'ПРОПУСТИТЬ →'}
        </button>
      </motion.div>
    </div>
  )
}
