import type { GameState } from '../core/GameEngine'

export const level3: GameState = {
  player: { x: 0, y: 2 },
  goal:   { x: 4, y: 2 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 12,
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level3Meta = {
  id: 3,
  title: 'Облако Скрай',
  description: 'Открытое пространство. Путь до Тиво — длинный.',
  hint: 'Повторяющиеся манёвры детектированы. Рекомендую:\nrepeat N {\n  move\n}\nТоплива: 12.',
  allowedCommands: ['move', 'repeat'],
  maxCommands: 10,
  minCommands: 2,
  fuel: 12,
}
