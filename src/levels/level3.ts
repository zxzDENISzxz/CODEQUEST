import type { GameState } from '../core/GameEngine'

export const level3: GameState = {
  player: { x: 0, y: 2 },
  goal:   { x: 4, y: 2 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty' ],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level3Meta = {
  id: 3,
  title: 'Циклы',
  description: 'Дойди до звезды используя команду repeat!',
  hint: 'Вместо четырёх одинаковых команд используй:\nrepeat 4 {\n  move\n}',
  allowedCommands: ['move', 'repeat'],
  maxCommands: 10,
  minCommands: 2, // repeat 4 { move }
}