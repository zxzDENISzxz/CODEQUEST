import type { GameState } from '../core/GameEngine'

export const level8: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 4 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 12,
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'wall',  'wall',  'wall',  'empty'],
    ['empty', 'wall',  'empty', 'wall',  'empty'],
    ['empty', 'empty', 'empty', 'wall',  'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level8Meta = {
  id: 8,
  title: 'Родной сектор',
  description: 'Последний переход. Арума ждёт. БИПП мигает тише обычного.',
  hint: '...Арума... топлива: 12... ...вперёд...',
  allowedCommands: ['move', 'turn', 'repeat'],
  maxCommands: 25,
  minCommands: 5,
  fuel: 12,
}
