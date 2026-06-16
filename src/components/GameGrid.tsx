import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import type { Cell, Position } from '../core/GameEngine'
import type { ObstacleTheme } from '../core/types'

interface Props {
  grid: Cell[][]
  player: Position
  goal: Position
  teleporting?: boolean
  rotation?: number
  obstacleTheme?: ObstacleTheme
  GoalPlanet?: ComponentType
  animating?: boolean
}

interface TrailDot { id: number; pos: Position }

const CELL = 64
const GAP = 4


type Theme = 'asteroid' | 'ice' | 'debris' | 'nebula'

const THEME_BG: Record<Theme, string> = {
  asteroid: '#1c1917',
  ice:      '#082f49',
  debris:   '#0f172a',
  nebula:   '#1e1b4b',
}


// ─── Астероид ───────────────────────────────────────────────
function Asteroid({ s }: { s: number }) {
  const rotateDur = 8 + s * 10
  const driftX = (s - 0.5) * 5
  const driftY = (s * 0.7 - 0.3) * 4
  const driftDur = 2.5 + s * 2
  const scale = 0.75 + s * 0.4

  return (
    <motion.div
      style={{ width: 52, height: 52 }}
      animate={{ x: [0, driftX, 0], y: [0, driftY, 0] }}
      transition={{ duration: driftDur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <motion.div
        style={{ width: 52, height: 52 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: rotateDur, repeat: Infinity, ease: 'linear' }}
      >
        <svg
          width="52" height="52" viewBox="0 0 52 52" fill="none"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          <polygon points="40,15 30,9 17,12 10,22 13,35 24,42 37,40 44,30" fill="#78716c"/>
          <polygon points="30,9 17,12 10,22 13,35" fill="#44403c" opacity="0.55"/>
          <circle cx="27" cy="24" r="5.5" fill="#57534e"/>
          <circle cx="35" cy="33" r="3.5" fill="#57534e"/>
          <circle cx="18" cy="32" r="3" fill="#57534e"/>
          <circle cx="30" cy="14" r="2" fill="#57534e"/>
          <ellipse cx="24" cy="17" rx="5" ry="3" fill="#d6d3d1" opacity="0.28"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}

// ─── Ледяной кристалл ────────────────────────────────────────
function IceCrystal({ s }: { s: number }) {
  const pulseDur = 2.5 + s * 2
  const rotateDur = 14 + s * 12
  const delay = s * 1.5

  return (
    <motion.div
      style={{ width: 48, height: 48 }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: rotateDur, repeat: Infinity, ease: 'linear' }}
    >
    <motion.div
      style={{ width: 48, height: 48 }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
      transition={{ duration: pulseDur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="24,4 37,12 37,28 24,36 11,28 11,12" fill="#bae6fd" opacity="0.55"/>
        <polygon points="24,8 34,14 34,26 24,32 14,26 14,14" fill="#7dd3fc" opacity="0.7"/>
        <polygon points="24,12 31,17 31,25 24,30 17,25 17,17" fill="#e0f2fe" opacity="0.85"/>
        <circle cx="24" cy="22" r="4.5" fill="white" opacity="0.6"/>
        <line x1="24" y1="4" x2="24" y2="36" stroke="white" strokeWidth="0.7" opacity="0.22"/>
        <line x1="11" y1="12" x2="37" y2="28" stroke="white" strokeWidth="0.7" opacity="0.22"/>
        <line x1="37" y1="12" x2="11" y2="28" stroke="white" strokeWidth="0.7" opacity="0.22"/>
        <circle cx="15" cy="14" r="1.5" fill="white" opacity="0.9"/>
        <circle cx="33" cy="28" r="1" fill="white" opacity="0.85"/>
        <circle cx="24" cy="8" r="1.2" fill="white" opacity="0.8"/>
      </svg>
    </motion.div>
    </motion.div>
  )
}

// ─── Космический мусор ───────────────────────────────────────
function Debris({ s }: { s: number }) {
  const d1 = 2.5 + s * 1.5
  const d2 = 3 + (1 - s) * 2
  const d3 = 2 + s * 1.8

  const baseAngle = Math.round(s * 360)

  return (
    <div style={{ width: 52, height: 52, position: 'relative', transform: `rotate(${baseAngle}deg)` }}>
      {/* Обломок панели */}
      <motion.div
        style={{ position: 'absolute', top: 7, left: 5 }}
        animate={{ x: [0, 2, -1, 0], y: [0, -2, 1, 0], rotate: [0, 4, -3, 0] }}
        transition={{ duration: d1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect x="1" y="1" width="20" height="9" rx="1.5" fill="#475569"/>
          <rect x="3" y="3" width="16" height="2.5" fill="#64748b" opacity="0.5"/>
          <rect x="1" y="6" width="20" height="1" fill="#1e293b" opacity="0.5"/>
          <line x1="11" y1="1" x2="11" y2="10" stroke="#334155" strokeWidth="0.8"/>
        </svg>
      </motion.div>
      {/* Труба / балка */}
      <motion.div
        style={{ position: 'absolute', top: 23, left: 12 }}
        animate={{ x: [0, -2, 1, 0], y: [0, 2, -1, 0], rotate: [20, 26, 18, 20] }}
        transition={{ duration: d2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
          <rect x="1" y="1" width="22" height="6" rx="2.5" fill="#64748b"/>
          <rect x="3" y="2.5" width="18" height="2" fill="#94a3b8" opacity="0.3"/>
          <circle cx="4" cy="4" r="1.5" fill="#475569"/>
          <circle cx="20" cy="4" r="1.5" fill="#475569"/>
        </svg>
      </motion.div>
      {/* Обломок корпуса */}
      <motion.div
        style={{ position: 'absolute', top: 33, left: 5 }}
        animate={{ x: [0, 3, -1, 0], y: [0, 1, 2, 0], rotate: [0, -6, 4, 0] }}
        transition={{ duration: d3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
          <polygon points="8,1 15,5 13,12 3,12 1,5" fill="#334155"/>
          <polygon points="8,1 15,5 8,5" fill="#475569" opacity="0.6"/>
          <circle cx="7" cy="8" r="1.5" fill="#1e293b"/>
        </svg>
      </motion.div>
      {/* Вращающийся болт */}
      <motion.div
        style={{ position: 'absolute', top: 17, left: 30 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3.5 + s * 3, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" fill="#64748b"/>
          <circle cx="5.5" cy="5.5" r="2.5" fill="#94a3b8"/>
          <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="#475569" strokeWidth="1.2"/>
          <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="#475569" strokeWidth="1.2"/>
        </svg>
      </motion.div>
    </div>
  )
}

// ─── Туманность ──────────────────────────────────────────────
function Nebula({ s }: { s: number }) {
  const pulseDur = 4 + s * 3
  const delay = s * 2
  const h1 = Math.round(255 + s * 35)
  const h2 = h1 + 15
  const h3 = h2 + 15

  return (
    <motion.div
      style={{ width: 56, height: 56 }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.62, 0.9, 0.62] }}
      transition={{ duration: pulseDur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="24" fill={`hsl(${h1},65%,28%)`} opacity="0.4"/>
        <ellipse cx="24" cy="26" rx="16" ry="14" fill={`hsl(${h1},60%,38%)`} opacity="0.45"/>
        <ellipse cx="33" cy="28" rx="14" ry="13" fill={`hsl(${h2},55%,46%)`} opacity="0.4"/>
        <ellipse cx="28" cy="22" rx="11" ry="9" fill={`hsl(${h3},50%,56%)`} opacity="0.38"/>
        <circle cx="27" cy="25" r="7" fill={`hsl(${h3},60%,68%)`} opacity="0.3"/>
        <circle cx="20" cy="22" r="1.3" fill="white" opacity="0.85"/>
        <circle cx="34" cy="30" r="0.9" fill="white" opacity="0.75"/>
        <circle cx="28" cy="16" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="36" cy="22" r="0.8" fill="white" opacity="0.7"/>
        <circle cx="22" cy="32" r="0.7" fill="white" opacity="0.65"/>
      </svg>
    </motion.div>
  )
}

// ─── Выбор препятствия ────────────────────────────────────────
function WallObstacle({ s, theme }: { s: number; theme: Theme }) {
  const actual: Theme = theme === 'debris' && s > 0.55 ? 'asteroid' : theme

  switch (actual) {
    case 'asteroid': return <Asteroid s={s} />
    case 'ice':      return <IceCrystal s={s} />
    case 'debris':   return <Debris s={s} />
    case 'nebula':   return <Nebula s={s} />
  }
}

// ─── Корабль Зикса ────────────────────────────────────────────
export function ShipSVG({ animating = false }: { animating?: boolean }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" overflow="visible">
      {animating && (
        <>
          <motion.ellipse cx="-12" cy="20" rx="14" ry="6"
            fill="#f97316" opacity="0.3"
            animate={{ rx: [14, 19, 11, 17, 14], opacity: [0.3, 0.5, 0.2, 0.4, 0.3] }}
            transition={{ duration: 0.13, repeat: Infinity, ease: 'linear' }}
          />
          <motion.ellipse cx="-5" cy="20" rx="9" ry="4"
            fill="#fbbf24" opacity="0.65"
            animate={{ rx: [9, 13, 7, 11, 9] }}
            transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.ellipse cx="0" cy="20" rx="5" ry="2.2"
            fill="#fef9c3" opacity="0.9"
            animate={{ rx: [5, 7, 4, 6, 5] }}
            transition={{ duration: 0.08, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
      <polygon points="36,20 8,10 8,30" fill="#93c5fd"/>
      <polygon points="12,10 6,4 8,10" fill="#60a5fa"/>
      <polygon points="12,30 6,36 8,30" fill="#60a5fa"/>
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#1e40af"/>
      <circle cx="21" cy="20" r="3.5" fill="#0ea5e9"/>
      <circle cx="21" cy="20" r="2" fill="#bae6fd"/>
      <rect x="4" y="15" width="5" height="10" rx="2" fill="#475569"/>
      <ellipse cx="3" cy="20" rx={animating ? 3.5 : 2.5} ry={animating ? 5 : 4} fill="#fbbf24" opacity="0.85"/>
      <ellipse cx="2" cy="20" rx={animating ? 2.5 : 1.5} ry={animating ? 3.5 : 2.5} fill="#fef08a" opacity="0.7"/>
    </svg>
  )
}

// ─── Основной компонент ───────────────────────────────────────
export function GameGrid({ grid, player, goal, teleporting = false, rotation = 0, obstacleTheme = 'asteroid', GoalPlanet, animating = false }: Props) {
  const theme = obstacleTheme

  const [wallSeeds] = useState<Record<string, number>>(() => {
    const seeds: Record<string, number> = {}
    grid.forEach((row, y) => row.forEach((cell, x) => {
      if (cell === 'wall') seeds[`${x}-${y}`] = Math.random()
    }))
    return seeds
  })

  const [trail, setTrail] = useState<TrailDot[]>([])
  const trailId = useRef(0)
  const prevPlayer = useRef(player)

  useEffect(() => {
    const prev = prevPlayer.current
    prevPlayer.current = player
    if (!animating) { setTrail([]); return }
    if (prev.x !== player.x || prev.y !== player.y) {
      setTrail(t => [...t.slice(-5), { id: trailId.current++, pos: prev }])
    }
  }, [player, animating])

  return (
    <div className="relative" style={{
      width: grid[0].length * CELL + (grid[0].length - 1) * GAP,
      height: grid.length * CELL + (grid.length - 1) * GAP,
    }}>
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isGoal = goal.x === x && goal.y === y
          const isWall = cell === 'wall'
          return (
            <div
              key={`${x}-${y}`}
              className="absolute rounded-lg flex items-center justify-center overflow-hidden"
              style={{
                width: CELL,
                height: CELL,
                left: x * (CELL + GAP),
                top: y * (CELL + GAP),
                backgroundColor: isWall ? THEME_BG[theme] : '#312e81',
              }}
            >
              {isWall && <WallObstacle s={wallSeeds[`${x}-${y}`] ?? 0.5} theme={theme} />}
              {isGoal && GoalPlanet && <div className="z-10"><GoalPlanet /></div>}
            </div>
          )
        })
      )}

      {trail.map((dot, i) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 7, height: 7,
            left: dot.pos.x * (CELL + GAP) + CELL / 2 - 3.5,
            top:  dot.pos.y * (CELL + GAP) + CELL / 2 - 3.5,
            background: '#60a5fa',
            boxShadow: '0 0 6px #3b82f6',
            zIndex: 8,
            opacity: (i + 1) / trail.length * 0.55,
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 0.4 }}
          transition={{ duration: 0.3 * (trail.length - i), ease: 'easeOut' }}
        />
      ))}

      <motion.div
        className="absolute flex items-center justify-center pointer-events-none z-10"
        style={{ width: CELL, height: CELL }}
        initial={false}
        animate={{
          x: player.x * (CELL + GAP),
          y: player.y * (CELL + GAP),
          opacity: teleporting ? 0 : 1,
          scale: teleporting ? 0 : 1,
          rotate: rotation,
        }}
        transition={{
          x: { type: 'tween', duration: teleporting ? 0 : 0.25, ease: 'easeInOut' },
          y: { type: 'tween', duration: teleporting ? 0 : 0.25, ease: 'easeInOut' },
          opacity: { duration: 0.25 },
          scale: { type: 'spring', stiffness: 300, damping: 15 },
          rotate: { type: 'spring', stiffness: 200, damping: 20 },
        }}
      >
        <ShipSVG animating={animating} />
      </motion.div>
    </div>
  )
}
