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

function MiniPlanet() {
  return (
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="15" fill="#4a044e"/>
      <circle cx="22" cy="22" r="15" fill="#6b21a8"/>
      <ellipse cx="22" cy="16" rx="11" ry="4" fill="#a21caf" opacity="0.65" transform="rotate(-8 22 16)"/>
      <circle cx="22" cy="22" r="15" fill="none" stroke="#e879f9" strokeWidth="1.2" opacity="0.45"/>
    </svg>
  )
}

// Строка кода с подсветкой синтаксиса
function CodeLine({ text, partial }: { text: string; partial?: boolean }) {
  if (!text && !partial) return null

  // repeat 3 {
  if (text.startsWith('repeat')) {
    const parts = text.match(/^(repeat)(\s+)(\d+)(\s*)(\{?)(.*)$/)
    if (parts) {
      return (
        <span>
          <span style={{ color: '#fb923c' }}>{parts[1]}</span>
          {parts[2]}
          <span style={{ color: '#60a5fa' }}>{parts[3]}</span>
          {parts[4]}
          <span style={{ color: '#94a3b8' }}>{parts[5]}</span>
          {parts[6]}
        </span>
      )
    }
  }
  // move (indented)
  if (text.trimStart().startsWith('move')) {
    const indent = text.match(/^(\s*)/)?.[1] ?? ''
    return (
      <span>
        {indent}
        <span style={{ color: '#34d399' }}>{text.trimStart()}</span>
      </span>
    )
  }
  // }
  return <span style={{ color: '#94a3b8' }}>{text}</span>
}

// Последовательность строк для анимации:
// line0 печатается посимвольно → line1 → line2 → пробел (ship движется) → финал
const FULL_LINES = ['repeat 3 {', '  move', '}']

export function RepeatHintPanel({ autoPlay = false }: { autoPlay?: boolean }) {
  const [open,    setOpen]    = useState(false)
  const [lines,   setLines]   = useState<string[]>([])
  const [shipPos, setShipPos] = useState(0)
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
      setLines([]); setShipPos(0)
      return
    }
    cancelRef.current = false
    const run = async () => {
      while (!cancelRef.current) {
        setLines([]); setShipPos(0)
        await wait(500)
        for (let li = 0; li < FULL_LINES.length; li++) {
          const fullLine = FULL_LINES[li]
          for (let ci = 1; ci <= fullLine.length; ci++) {
            if (cancelRef.current) return
            const partial = fullLine.slice(0, ci)
            setLines(prev => { const next = [...prev]; next[li] = partial; return next })
            await wait(li === 0 ? 90 : 110)
          }
          if (li < FULL_LINES.length - 1) await wait(200)
        }
        await wait(500)
        for (let step = 1; step <= 3; step++) {
          if (cancelRef.current) return
          setShipPos(step); await wait(400)
        }
        await wait(900)
      }
    }
    run()
    return () => { cancelRef.current = true }
  }, [active])

  const lastLineIdx = lines.length - 1

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
            width: CELL, height: CELL, background: '#1e1b4b',
            borderRadius: 7, flexShrink: 0,
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
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
        >
          <MiniShip />
        </motion.div>
      </div>
      <div style={{
        background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
        padding: '10px 12px', fontFamily: 'monospace', fontSize: 14, lineHeight: 1.7,
        height: 96, width: '100%', boxSizing: 'border-box', overflow: 'hidden',
      }}>
        {FULL_LINES.map((_, li) => {
          const printed = lines[li] ?? ''
          if (!printed && li > (lines.length - 1)) return null
          const isLast = li === lastLineIdx
          return (
            <div key={li}>
              <CodeLine text={printed} />
              {isLast && (
                <span style={{
                  display: 'inline-block', width: 2, height: 14,
                  background: cursor ? '#94a3b8' : 'transparent', marginLeft: 1, verticalAlign: 'middle',
                }} />
              )}
            </div>
          )
        })}
      </div>
      <p style={{ color: '#4b5563', fontSize: 11, marginTop: 8, fontFamily: 'monospace' }}>
        <span style={{ color: '#fb923c' }}>repeat</span>{' '}
        <span style={{ color: '#60a5fa' }}>N</span>{' '}
        <span style={{ color: '#94a3b8' }}>{'{ }'}</span>
        {' '}— повторить N раз команду в скобках
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
        <span style={{ fontSize: 13, color: '#60a5fa' }}>↺</span>
        <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
          Как работает <span style={{ color: '#fb923c', fontFamily: 'monospace' }}>repeat</span>?
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
