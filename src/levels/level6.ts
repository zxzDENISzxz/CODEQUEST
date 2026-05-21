import type { GameState } from '../core/GameEngine'

export const level6: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 0 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 14,
  grid: [
    ['empty', 'wall',  'empty', 'empty', 'empty'],
    ['empty', 'wall',  'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level6Meta = {
  id: 6,
  title: 'Кольца Зура',
  description: 'Ледяные кольца перекрыли прямой путь к Сиэл. Найди обход.',
  hint: 'Прямой курс заблокирован. Рекомендую обход через нижний коридор. Топлива: 14.',
  allowedCommands: ['move', 'turn'],
  maxCommands: 20,
  minCommands: 11,
  fuel: 14,
}
