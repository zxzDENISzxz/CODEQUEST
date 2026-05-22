import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CELL = 44
const GAP  = 4
const COLS = 4

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

function MiniShip() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <polygon points="36,20 8,10 8,30" fill="#93c5fd"/>
      <polygon points="12,10 6,4 8,10"  fill="#60a5fa"/>
      <polygon points="12,30 6,36 8,30" fill="#60a5fa"/>
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#1e40af"/>
      <circle  cx="21" cy="20" r="3.5"        fill="#0ea5e9"/>
      <circle  cx="21" cy="20" r="2"           fill="#bae6fd"/>
      <rect x="4" y="15" width="5" height="10" rx="2" fill="#475569"/>
      <ellipse cx="3" cy="20" rx="2.5" ry="4"   fill="#fbbf24" opacity="0.85"/>
      <ellipse cx="2" cy="20" rx="1.5" ry="2.5" fill="#fef08a" opacity="0.7"/>
    </svg>
  )
}

// Упрощённая планета Пиксо для мини-сетки
function MiniPlanet() {
  return (
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="15" fill="#3b0764"/>
      <circle cx="22" cy="22" r="15" fill="#5b21b6"/>
      <ellipse cx="19" cy="17" rx="8" ry="5" fill="#7c3aed" opacity="0.75" transform="rotate(-10 19 17)"/>
      <circle cx="22" cy="22" r="15" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.55"/>
    </svg>
  )
}

export function MoveHintPanel({ autoPlay = false }: { autoPlay?: boolean }) {
  const [open,    setOpen]    = useState(false)
  const [shipPos, setShipPos] = useState(0)
  const [typed,   setTyped]   = useState('')
  const [cursor,  setCursor]  = useState(true)
  const cancelRef = useRef(false)
  const active = open || autoPlay

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!active) {
      cancelRef.current = true
      setShipPos(0); setTyped('')
      return
    }
    cancelRef.current = false
    const run = async () => {
      while (!cancelRef.current) {
        setShipPos(0); setTyped('')
        await wait(600)
        for (let step = 1; step <= COLS - 1; step++) {
          for (const ch of 'move') {
            if (cancelRef.current) return
            setTyped(prev => prev + ch); await wait(120)
          }
          await wait(380); if (cancelRef.current) return
          setShipPos(step); await wait(420); if (cancelRef.current) return
          setTyped(''); await wait(280)
        }
        await wait(900)
      }
    }
    run()
    return () => { cancelRef.current = true }
  }, [active])

  const body = (
    <div style={{
      padding: '16px 14px 14px',
      background: 'rgba(15,12,40,0.88)',
      border: '1px solid rgba(99,102,241,0.35)',
      borderTop: autoPlay ? undefined : 'none',
      borderRadius: autoPlay ? 10 : '0 0 10px 10px',
    }}>
      <div style={{ position: 'relative', display: 'flex', gap: GAP, marginBottom: 14 }}>
        {Array.from({ length: COLS }).map((_, i) => (
          <div key={i} style={{
            width: CELL, height: CELL, background: '#1e1b4b', borderRadius: 7, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {i === COLS - 1 && <MiniPlanet />}
          </div>
        ))}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, width: CELL, height: CELL,
            display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}
          animate={{ x: shipPos * (CELL + GAP) }}
          transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
        >
          <MiniShip />
        </motion.div>
      </div>
      <div style={{
        background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
        padding: '8px 12px', fontFamily: 'monospace', fontSize: 15,
        minHeight: 38, display: 'flex', alignItems: 'center',
      }}>
        <span style={{ color: '#34d399' }}>{typed}</span>
        <span style={{
          display: 'inline-block', width: 2, height: 16,
          background: cursor ? '#34d399' : 'transparent', marginLeft: 1,
        }} />
      </div>
      <p style={{ color: '#4b5563', fontSize: 11, marginTop: 8, fontFamily: 'monospace' }}>
        каждый <span style={{ color: '#34d399' }}>move</span> — один шаг вперёд
      </p>
    </div>
  )

  if (autoPlay) return <div>{body}</div>

  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
          background: open ? 'rgba(30,27,75,0.7)' : 'rgba(30,27,75,0.45)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: open ? '10px 10px 0 0' : 10,
          cursor: 'pointer', transition: 'background 0.2s, border-radius 0.15s', userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 13, color: '#34d399' }}>▶</span>
        <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
          Как работает <span style={{ color: '#34d399', fontFamily: 'monospace' }}>move</span>?
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4b5563' }}>{open ? '▲' : '▼'}</span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="demo" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            {body}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
