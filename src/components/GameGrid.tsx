import { motion } from 'framer-motion'
import type { Cell, Position, Direction } from '../core/GameEngine'

interface Props {
  grid: Cell[][]
  player: Position
  goal: Position
  teleporting?: boolean
  direction?: Direction
}

const CELL = 64
const GAP = 4

const DIRECTION_ANGLE: Record<Direction, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: -90,
}

function RobotSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Тело */}
      <rect x="8" y="14" width="24" height="18" rx="4" fill="#6366f1"/>
      {/* Голова */}
      <rect x="11" y="5" width="18" height="14" rx="4" fill="#818cf8"/>
      {/* Антенна */}
      <line x1="20" y1="5" x2="20" y2="1" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="1" r="2" fill="#fbbf24"/>
      {/* Глаза */}
      <circle cx="15" cy="12" r="3" fill="white"/>
      <circle cx="25" cy="12" r="3" fill="white"/>
      <circle cx="15" cy="12" r="1.5" fill="#1e1b4b"/>
      <circle cx="25" cy="12" r="1.5" fill="#1e1b4b"/>
      {/* Рот — стрелка показывает направление */}
      <path d="M14 22 L20 18 L26 22" fill="#fbbf24"/>
      {/* Ноги */}
      <rect x="11" y="30" width="6" height="8" rx="2" fill="#6366f1"/>
      <rect x="23" y="30" width="6" height="8" rx="2" fill="#6366f1"/>
      {/* Руки */}
      <rect x="2" y="16" width="6" height="4" rx="2" fill="#818cf8"/>
      <rect x="32" y="16" width="6" height="4" rx="2" fill="#818cf8"/>
    </svg>
  )
}

export function GameGrid({ grid, player, goal, teleporting = false, direction = 'right' }: Props) {
  return (
    <div className="relative" style={{
      width: grid[0].length * CELL + (grid[0].length - 1) * GAP,
      height: grid.length * CELL + (grid.length - 1) * GAP,
    }}>
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isGoal = goal.x === x && goal.y === y
          return (
            <div
              key={`${x}-${y}`}
              className={`absolute rounded-lg flex items-center justify-center text-2xl
                ${cell === 'wall' ? 'bg-slate-600' : 'bg-indigo-900'}`}
              style={{
                width: CELL,
                height: CELL,
                left: x * (CELL + GAP),
                top: y * (CELL + GAP),
              }}
            >
              {isGoal && '⭐'}
            </div>
          )
        })
      )}

      <motion.div
        className="absolute flex items-center justify-center pointer-events-none z-10"
        style={{ width: CELL, height: CELL }}
        initial={false}
        animate={{
          x: player.x * (CELL + GAP),
          y: player.y * (CELL + GAP),
          opacity: teleporting ? 0 : 1,
          scale: teleporting ? 0 : 1,
          rotate: teleporting ? 180 : DIRECTION_ANGLE[direction],
        }}
        transition={{
          x: { type: 'tween', duration: teleporting ? 0 : 0.25, ease: 'easeInOut' },
          y: { type: 'tween', duration: teleporting ? 0 : 0.25, ease: 'easeInOut' },
          opacity: { duration: 0.25 },
          scale: { type: 'spring', stiffness: 300, damping: 15 },
          rotate: { type: 'spring', stiffness: 200, damping: 20 },
        }}
      >
        <RobotSVG />
      </motion.div>
    </div>
  )
}