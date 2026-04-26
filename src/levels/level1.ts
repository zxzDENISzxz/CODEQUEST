import type { GameState } from '../core/GameEngine'

export const level1: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 0 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty']
  ],
}

export const level1Meta = {
  id: 1,
  title: 'Первые шаги',
  description: 'Помоги роботу добраться до звезды!',
  hint: 'Используй команду: "move" для перемещения.',
  allowedCommands: ['move'],
  maxCommands: 10,
  minCommands: 2,
}