import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetDrax } from '../components/GoalPlanets'

const FUEL = 8;

export const level7: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'wall',  'empty', 'empty'],
      ['wall',   'empty', 'wall',  'empty', 'wall' ],
      ['wall',   'empty', 'empty', 'empty', 'empty'],
      ['wall',   'empty', 'empty', 'wall',  'empty'],
      ['empty',  'empty', 'empty', 'empty', 'goal' ],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 7,
    title: 'Сектор Буря',
    description: 'Хаотичное поле обломков. Дракс еле виден сквозь помехи.',
    hint: `Плотность обломков — максимальная. Ищи узкий проход. Топлива: ${FUEL}.`,
    minCommands: 8,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetDrax,
    mapPosition: { x: 36, y: 67 },
    mapColor: { color: '#9ca3af', glow: 'rgba(156,163,175,0.40)' },
  },
}
