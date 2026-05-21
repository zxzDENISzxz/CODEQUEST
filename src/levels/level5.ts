import type { LevelDef } from '../core/types'
import { PlanetNox } from '../components/GoalPlanets'

export const level5: LevelDef = {
  state: {
    player: { x: 0, y: 0 },
    goal:   { x: 4, y: 4 },
    direction: 'right',
    fuel: 14,
    grid: [
      ['empty', 'empty', 'empty', 'wall',  'empty'],
      ['empty', 'wall',  'empty', 'wall',  'empty'],
      ['empty', 'wall',  'empty', 'empty', 'empty'],
      ['empty', 'wall',  'wall',  'wall',  'empty'],
      ['empty', 'empty', 'wall',  'empty', 'empty'],
    ],
  },
  meta: {
    id: 5,
    title: 'Серая зона',
    description: 'Обломки старых кораблей. Нокс почти не видна в помехах.',
    hint: 'Сложный рельеф. Можно вкладывать repeat внутрь repeat.\nТоплива: 14.',
    minCommands: 13,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetNox,
    mapPosition: { x: 82, y: 44 },
    mapColor: { color: '#94a3b8', glow: 'rgba(148,163,184,0.40)' },
  },
}
