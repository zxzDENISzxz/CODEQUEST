import type { Command } from './CommandParser'

export interface Position {
  x: number
  y: number
}

export type Cell = 'empty' | 'wall' | 'goal'
export type Direction = 'up' | 'down' | 'left' | 'right'

export type GameEvent =
  | { type: 'move'; position: Position; commandIndex: number }
  | { type: 'turn'; direction: Direction; commandIndex: number }
  | { type: 'fail'; commandIndex: number }
  | { type: 'win'; commandIndex: number }

export interface GameState {
  player: Position
  goal: Position
  grid: Cell[][]
  status: 'idle' | 'win' | 'fail'
  steps: Position[]
  direction: Direction
}

export function runCommands(state: GameState, commands: Command[]): {
  events: GameEvent[]
  finalState: GameState
} {
  const player = { ...state.player }
  const dirState = { direction: state.direction ?? 'right' as Direction }
  const events: GameEvent[] = []

  try {
    executeCommands(commands, player, state.grid, dirState, events, { index: 0 })
  } catch (e: unknown) {
    const finalState: GameState = {
      ...state,
      player,
      steps: events.filter(e => e.type === 'move').map(e => (e as { position: Position }).position),
      status: 'fail',
      direction: dirState.direction,
    }
    return { events, finalState }
  }

  const won = player.x === state.goal.x && player.y === state.goal.y
  events.push({ type: won ? 'win' : 'fail', commandIndex: -1 })

  const finalState: GameState = {
    ...state,
    player,
    steps: events.filter(e => e.type === 'move').map(e => (e as { position: Position }).position),
    status: won ? 'win' : 'fail',
    direction: dirState.direction,
  }

  return { events, finalState }
}

function executeCommands(
  commands: Command[],
  player: Position,
  grid: Cell[][],
  dirState: { direction: Direction },
  events: GameEvent[],
  counter: { index: number }
): void {
  const directions: Direction[] = ['right', 'down', 'left', 'up']
  
  for (const cmd of commands) {
    const cmdIndex = counter.index++

    if (cmd.type === 'turn') {
      // Поворот на 90 градусов по часовой стрелке
      const currentIdx = directions.indexOf(dirState.direction)
      dirState.direction = directions[(currentIdx + 1) % 4]
      events.push({ type: 'turn', direction: dirState.direction, commandIndex: cmdIndex })
    }

    if (cmd.type === 'move') {
      const next = moveOne(player, dirState.direction)
      if (!isValid(next, grid)) {
        events.push({ type: 'fail', commandIndex: cmdIndex })
        throw { commandIndex: cmdIndex }
      }
      player.x = next.x
      player.y = next.y
      events.push({ type: 'move', position: { ...player }, commandIndex: cmdIndex })
    }

    if (cmd.type === 'repeat') {
      for (let i = 0; i < cmd.times; i++) {
        executeCommands(cmd.commands, player, grid, dirState, events, counter)
      }
    }
  }
}

export function countCommands(commands: Command[]): number {
  let count = 0
  for (const cmd of commands) {
    if (cmd.type === 'move' || cmd.type === 'turn') count++
    if (cmd.type === 'repeat') {
      count++
      count += countCommands(cmd.commands)
    }
  }
  return count
}

function moveOne(pos: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':    return { x: pos.x, y: pos.y - 1 }
    case 'down':  return { x: pos.x, y: pos.y + 1 }
    case 'left':  return { x: pos.x - 1, y: pos.y }
    case 'right': return { x: pos.x + 1, y: pos.y }
  }
}

function isValid(pos: Position, grid: Cell[][]): boolean {
  if (pos.y < 0 || pos.y >= grid.length) return false
  if (pos.x < 0 || pos.x >= grid[0].length) return false
  if (grid[pos.y][pos.x] === 'wall') return false
  return true
}