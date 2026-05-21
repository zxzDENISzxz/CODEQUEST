import { runCommands } from './GameEngine'
import { parseCommands } from './CommandParser'
import type { GameState } from './GameEngine'

const state: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 2, y: 0 },
  status: 'idle',
  steps: [],
  direction: 'right',
  grid: [
    ['empty', 'empty', 'goal'],
    ['empty', 'empty', 'empty'],
  ],
}

const parsed = parseCommands('repeat 2 {\n  move\n}')
if (!parsed.ok) throw new Error(parsed.error)

const result = runCommands(state, parsed.commands)
console.log('Статус:', result.finalState.status)   // должно быть "win"
console.log('Шаги:', result.finalState.steps)      // путь персонажа