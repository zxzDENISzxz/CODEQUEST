import type { GameState } from '../core/GameEngine'

export const level1: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 0 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 12,
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty']
  ],
}

export const level1Meta = {
  id: 1,
  title: 'Туманность Веги',
  description: 'Зикс входит в первый сектор. Планета Пиксо виднеется вдали.',
  hint: 'Топлива: 4 единицы. Один манёвр — минус одно деление.\nКоманда: move',
  allowedCommands: ['move'],
  maxCommands: 4,
  minCommands: 2,
  fuel: 4,
}
