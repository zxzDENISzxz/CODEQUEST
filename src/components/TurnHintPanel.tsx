import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CELL = 50
const GAP  = 4

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

function MiniShip({ rotation }: { rotation: number }) {
  return (
    <motion.svg
      width="28" height="28" viewBox="0 0 40 40" fill="none"
      animate={{ rotate: rotation }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <polygon points="36,20 8,10 8,30" fill="#93c5fd"/>
      <polygon points="12,10 6,4 8,10"  fill="#60a5fa"/>
      <polygon points="12,30 6,36 8,30" fill="#60a5fa"/>
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#1e40af"/>
      <circle  cx="21" cy="20" r="3.5"        fill="#0ea5e9"/>
      <circle  cx="21" cy="20" r="2"           fill="#bae6fd"/>
      <rect x="4" y="15" width="5" height="10" rx="2" fill="#475569"/>
      <ellipse cx="3" cy="20" rx="2.5" ry="4"   fill="#fbbf24" opacity="0.85"/>
      <ellipse cx="2" cy="20" rx="1.5" ry="2.5" fill="#fef08a" opacity="0.7"/>
    </motion.svg>
  )
}

function MiniPlanet() {
  return (
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="15" fill="#7c2d12"/>
      <circle cx="22" cy="22" r="15" fill="#9a3412"/>
      <ellipse cx="18" cy="18" rx="7" ry="4" fill="#c2410c" opacity="0.75" transform="rotate(-15 18 18)"/>
      <circle cx="22" cy="22" r="15" fill="none" stroke="#fb923c" strokeWidth="1.2" opacity="0.4"/>
    </svg>
  )
}

export function TurnHintPanel() {
  const [hovered, setHovered] = useState(false)
  const [shipX,     setShipX]    = useState(0)
  const [shipY,     setShipY]    = useState(0)
  const [rotation,  setRotation] = useState(0)
  const [typed,   setTyped]   = useState('')
  const [cursor,  setCursor]  = useState(true)
  const cancelRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!hovered) {
      cancelRef.current = true
      setShipX(0); setShipY(0); setRotation(0); setTyped('')
      return
    }
    cancelRef.current = false

    const run = async () => {
      while (!cancelRef.current) {
        setShipX(0); setShipY(0); setRotation(0); setTyped('')
        await wait(600)

        // turn → вниз (+90)
        for (const ch of 'turn') { if (cancelRef.current) return; setTyped(p => p + ch); await wait(120) }
        await wait(380); if (cancelRef.current) return
        setRotation(r => r + 90); setTyped(''); await wait(380)

        // move → (0,1)
        for (const ch of 'move') { if (cancelRef.current) return; setTyped(p => p + ch); await wait(120) }
        await wait(380); if (cancelRef.current) return
        setShipY(1); setTyped(''); await wait(380)

        // turn → влево (+90)
        for (const ch of 'turn') { if (cancelRef.current) return; setTyped(p => p + ch); await wait(120) }
        await wait(380); if (cancelRef.current) return
        setRotation(r => r + 90); setTyped(''); await wait(380)

        // turn → вверх (+90)
        for (const ch of 'turn') { if (cancelRef.current) return; setTyped(p => p + ch); await wait(120) }
        await wait(380); if (cancelRef.current) return
        setRotation(r => r + 90); setTyped(''); await wait(380)

        // turn → вправо (+90)
        for (const ch of 'turn') { if (cancelRef.current) return; setTyped(p => p + ch); await wait(120) }
        await wait(380); if (cancelRef.current) return
        setRotation(r => r + 90); setTyped(''); await wait(380)

        // move → (1,1) — цель
        for (const ch of 'move') { if (cancelRef.current) return; setTyped(p => p + ch); await wait(120) }
        await wait(380); if (cancelRef.current) return
        setShipX(1); setTyped(''); await wait(1000)
      }
    }

    run()
    return () => { cancelRef.current = true }
  }, [hovered])

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px',
        background: hovered ? 'rgba(30,27,75,0.7)' : 'rgba(30,27,75,0.45)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: hovered ? '10px 10px 0 0' : 10,
        cursor: 'default', transition: 'background 0.2s, border-radius 0.15s',
        userSelect: 'none',
      }}>
        <span style={{ fontSize: 13, color: '#fb923c' }}>↻</span>
        <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
          Как работает{' '}
          <span style={{ color: '#fb923c', fontFamily: 'monospace' }}>turn</span>?
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4b5563' }}>
          {hovered ? '▲' : '▼'}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {hovered && (
          <motion.div
            key="demo"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '16px 14px 14px',
              background: 'rgba(15,12,40,0.88)',
              border: '1px solid rgba(99,102,241,0.35)',
              borderTop: 'none', borderRadius: '0 0 10px 10px',
            }}>
              {/* 2×2 сетка */}
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `${CELL}px ${CELL}px`, gap: GAP, marginBottom: 14, width: 'fit-content' }}>
                {([0,0,1,0,0,1,1,1] as number[]).reduce<[number,number][]>((acc,_,i,a) =>
                  i % 2 === 0 ? [...acc, [a[i], a[i+1]]] : acc, []
                ).map(([x, y]) => (
                  <div key={`${x}-${y}`} style={{
                    width: CELL, height: CELL, background: '#1e1b4b',
                    borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {x === 1 && y === 1 && <MiniPlanet />}
                  </div>
                ))}

                <motion.div
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: CELL, height: CELL,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                  animate={{ x: shipX * (CELL + GAP), y: shipY * (CELL + GAP) }}
                  transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
                >
                  <MiniShip rotation={rotation} />
                </motion.div>
              </div>

              <div style={{
                background: '#0f172a', border: '1px solid #334155',
                borderRadius: 8, padding: '8px 12px',
                fontFamily: 'monospace', fontSize: 15, minHeight: 38,
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ color: '#fb923c' }}>{typed}</span>
                <span style={{
                  display: 'inline-block', width: 2, height: 16,
                  background: cursor ? '#fb923c' : 'transparent', marginLeft: 1,
                }} />
              </div>

              <p style={{ color: '#4b5563', fontSize: 11, marginTop: 8, fontFamily: 'monospace' }}>
                <span style={{ color: '#fb923c' }}>turn</span> — поворот на 90° по часовой стрелке
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
