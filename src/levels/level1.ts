import type { GameState } from '../core/GameEngine'

export const level1: GameState = {
  player: { x: 0, y: 2 },
  goal:   { x: 4, y: 2 },
  status: 'idle',
  steps:  [],
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'wall',  'wall',  'wall',  'empty'],
    ['empty', 'empty', 'empty', 'empty', 'goal' ],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level1Meta = {
  id: 1,
  title: 'Первые шаги',
  description: 'Помоги роботу добраться до звезды! Используй команду move.',
  hint: 'Попробуй: move right',
  allowedCommands: ['move'],
  maxCommands: 10,
}