import type { GameState } from '../core/GameEngine'

export const level7: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 4 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 14,
  grid: [
    ['empty', 'empty', 'wall',  'empty', 'empty'],
    ['wall',  'empty', 'wall',  'empty', 'wall' ],
    ['wall',  'empty', 'empty', 'empty', 'wall' ],
    ['wall',  'empty', 'empty', 'wall',  'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level7Meta = {
  id: 7,
  title: 'Сектор Буря',
  description: 'Хаотичное поле обломков. Дракс еле виден сквозь помехи.',
  hint: 'Плотность обломков — максимальная. Ищи узкий проход. Топлива: 14.',
  allowedCommands: ['move', 'turn', 'repeat'],
  maxCommands: 25,
  minCommands: 9,
  fuel: 14,
}
