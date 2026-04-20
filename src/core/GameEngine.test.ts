import { runCommands } from './GameEngine'
import { parseCommands } from './CommandParser'
import type { GameState } from './GameEngine'

const state: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 2, y: 0 },
  status: 'idle',
  steps: [],
  grid: [
    ['empty', 'empty', 'goal'],
    ['empty', 'empty', 'empty'],
  ],
}

const parsed = parseCommands('move right\nmove right')
if (!parsed.ok) throw new Error(parsed.error)

const result = runCommands(state, parsed.commands)
console.log('Статус:', result.status)   // должно быть "win"
console.log('Шаги:', result.steps)      // путь персонажа