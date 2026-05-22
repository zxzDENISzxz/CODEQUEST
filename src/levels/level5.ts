import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetNox } from '../components/GoalPlanets'

const FUEL = 8;

export const level5: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'empty', 'wall',  'empty'],
      ['empty',  'wall',  'empty', 'wall',  'empty'],
      ['empty',  'wall',  'empty', 'empty', 'empty'],
      ['empty',  'wall',  'wall',  'wall',  'empty'],
      ['empty',  'empty', 'wall',  'empty', 'goal' ],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 5,
    title: 'Серая зона',
    description: 'Обломки старых кораблей. Нокс почти не видна в помехах.',
    hint: `Сложный рельеф. Можно вкладывать repeat внутрь repeat.\nТоплива: ${FUEL}.`,
    minCommands: 8,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetNox,
    mapPosition: { x: 82, y: 44 },
    mapColor: { color: '#94a3b8', glow: 'rgba(148,163,184,0.40)' },
  },
}
