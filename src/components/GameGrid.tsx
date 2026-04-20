import type { Cell } from '../core/GameEngine'
import type { Position } from '../core/GameEngine'

interface Props {
  grid: Cell[][]
  player: Position
  goal: Position
}

const cellSize = 64

export function GameGrid({ grid, player, goal }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {grid.map((row, y) => (
        <div key={y} className="flex gap-1">
          {row.map((cell, x) => {
            const isPlayer = player.x === x && player.y === y
            const isGoal   = goal.x === x   && goal.y === y

            return (
              <div
                key={x}
                style={{ width: cellSize, height: cellSize }}
                className={`
                  rounded-lg flex items-center justify-center text-2xl
                  ${cell === 'wall'  ? 'bg-slate-600' : 'bg-indigo-900'}
                  ${isPlayer ? 'ring-2 ring-yellow-400' : ''}
                `}
              >
                {isPlayer && '🤖'}
                {isGoal   && !isPlayer && '⭐'}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}