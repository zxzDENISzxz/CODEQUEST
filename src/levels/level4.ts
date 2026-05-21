import type { GameState } from '../core/GameEngine'

export const level4: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 2, y: 2 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 16,
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'wall',  'wall',  'empty', 'empty'],
    ['empty', 'wall',  'empty', 'empty', 'empty'],
    ['empty', 'wall',  'empty', 'wall',  'empty'],
    ['empty', 'empty', 'empty', 'wall',  'empty'],
  ],
}

export const level4Meta = {
  id: 4,
  title: 'Разлом Кеола',
  description: 'Плотный астероидный пояс. Эмбра где-то внутри.',
  hint: 'Маршрут неоднозначен. Комбинируй move, turn, repeat.\nТоплива: 16.',
  allowedCommands: ['move', 'repeat', 'turn'],
  maxCommands: 15,
  minCommands: 7,
  fuel: 16,
}
