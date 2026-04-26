import type { GameState } from '../core/GameEngine'

export const level4: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 2, y: 2 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'wall',  'wall',  'empty', 'empty'],
    ['empty', 'wall',  'empty', 'empty', 'empty'],
    ['empty', 'wall',  'empty', 'wall',  'empty'],
    ['empty', 'empty', 'empty', 'wall',  'empty' ],
  ],
}

export const level4Meta = {
  id: 4,
  title: 'Лабиринт с циклами',
  description: 'Используй repeat чтобы сократить код!',
  hint: 'Комбинируй move и repeat\nrepeat N {\n  команды\n}',
  allowedCommands: ['move', 'repeat', 'direction'],
  maxCommands: 15,
  minCommands: 5,
}