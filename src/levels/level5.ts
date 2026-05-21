import type { GameState } from '../core/GameEngine'

export const level5: GameState = {
  player: { x: 0, y: 0 },
  goal:   { x: 4, y: 4 },
  status: 'idle',
  steps:  [],
  direction: 'right',
  grid: [
    ['empty', 'empty', 'empty', 'wall',  'empty'],
    ['empty', 'wall',  'empty', 'wall',  'empty'],
    ['empty', 'wall',  'empty', 'empty', 'empty'],
    ['empty', 'wall',  'wall',  'wall',  'empty'],
    ['empty', 'empty', 'wall', 'empty', 'empty' ],
  ],
}

export const level5Meta = {
  id: 5,
  title: 'Мастер циклов',
  description: 'Финальный уровень! Используй всё что знаешь.',
  hint: 'Комбинируй repeat и move\nМожно вкладывать repeat внутрь repeat',
  allowedCommands: ['move', 'repeat', 'turn'],
  maxCommands: 20,
  minCommands: 5,
}