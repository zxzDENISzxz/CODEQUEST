import type { GameState } from '../core/GameEngine'

export const level5: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 4 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 14,
  grid: [
    ['empty', 'empty', 'empty', 'wall',  'empty'],
    ['empty', 'wall',  'empty', 'wall',  'empty'],
    ['empty', 'wall',  'empty', 'empty', 'empty'],
    ['empty', 'wall',  'wall',  'wall',  'empty'],
    ['empty', 'empty', 'wall', 'empty', 'empty'],
  ],
}

export const level5Meta = {
  id: 5,
  title: 'Серая зона',
  description: 'Обломки старых кораблей. Нокс почти не видна в помехах.',
  hint: 'Сложный рельеф. Можно вкладывать repeat внутрь repeat.\nТоплива: 14.',
  allowedCommands: ['move', 'repeat', 'turn'],
  maxCommands: 20,
  minCommands: 13,
  fuel: 14,
}
