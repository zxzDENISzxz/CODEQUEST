import type { Command } from './CommandParser'

export interface Position {
  x: number
  y: number
}

export interface GameState {
  player: Position
  goal: Position
  grid: Cell[][]
  status: 'idle' | 'running' | 'win' | 'fail'
  steps: Position[] // история шагов для анимации
}

export type Cell = 'empty' | 'wall' | 'goal'

// Выполняет команды и возвращает список позиций (каждый шаг)
export function runCommands(state: GameState, commands: Command[]): GameState {
  let player = { ...state.player }
  const steps: Position[] = [{ ...player }]

  try {
    executeCommands(commands, player, state.grid, steps)
    player = steps[steps.length - 1]
  } catch (e) {
    return { ...state, status: 'fail', steps }
  }

  const lastPos = steps[steps.length - 1]
  const won = lastPos.x === state.goal.x && lastPos.y === state.goal.y

  return {
    ...state,
    player,
    steps,
    status: won ? 'win' : 'fail',
  }
}

function executeCommands(
  commands: Command[],
  player: Position,
  grid: Cell[][],
  steps: Position[]
): void {
  for (const cmd of commands) {
    if (cmd.type === 'move') {
      const next = move(player, cmd.direction)

      if (!isValid(next, grid)) {
        throw new Error('Врезался в стену или вышел за границу!')
      }

      player.x = next.x
      player.y = next.y
      steps.push({ ...player })
    }

    if (cmd.type === 'repeat') {
      for (let i = 0; i < cmd.times; i++) {
        executeCommands(cmd.commands, player, grid, steps)
      }
    }
  }
}

function move(pos: Position, direction: string): Position {
  switch (direction) {
    case 'up':    return { x: pos.x, y: pos.y - 1 }
    case 'down':  return { x: pos.x, y: pos.y + 1 }
    case 'left':  return { x: pos.x - 1, y: pos.y }
    case 'right': return { x: pos.x + 1, y: pos.y }
    default: throw new Error(`Неизвестное направление: ${direction}`)
  }
}

function isValid(pos: Position, grid: Cell[][]): boolean {
  if (pos.y < 0 || pos.y >= grid.length) return false
  if (pos.x < 0 || pos.x >= grid[0].length) return false
  if (grid[pos.y][pos.x] === 'wall') return false
  return true
}