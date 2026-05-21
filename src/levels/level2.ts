import type { GameState } from '../core/GameEngine'

export const level2: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 0 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  grid: [
    ['empty', 'wall', 'empty', 'empty', 'empty'],
    ['empty', 'wall', 'empty', 'wall', 'wall'],
    ['empty', 'wall', 'empty', 'empty', 'empty'],
    ['empty', 'wall', 'wall', 'wall', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level2Meta = {
  id: 2,
  title: 'Направление',
  description: 'Помоги роботу добраться до звезды!',
  hint: 'Попробуй: "turn" чтобы повернуться на 90°, "move" чтобы двигаться.',
  allowedCommands: ['move', 'turn'],
  maxCommands: 20,
  minCommands: 12,
}