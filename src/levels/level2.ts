import type { GameState } from '../core/GameEngine'

export const level2: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 0 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  fuel: 24,
  grid: [
    ['empty', 'wall', 'empty', 'empty', 'empty'],
    ['empty', 'wall', 'empty', 'wall', 'wall'],
    ['empty', 'wall', 'empty', 'empty', 'empty'],
    ['empty', 'wall', 'wall', 'wall', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ],
}

export const level2Meta = {
  id: 2,
  title: 'Пояс Дарна',
  description: 'Первые астероиды. Прямой курс на Руфу заблокирован.',
  hint: 'Препятствия обнаружены. turn — поворот 90°. move — манёвр.\nТоплива: 24.',
  allowedCommands: ['move', 'turn'],
  maxCommands: 20,
  minCommands: 16,
  fuel: 20,
}
