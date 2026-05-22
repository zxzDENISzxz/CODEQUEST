import type { LevelDef } from '../core/types'
import { PlanetDrax } from '../components/GoalPlanets'

const FUEL = 8;

export const level7: LevelDef = {
  state: {
    player: { x: 0, y: 0 },
    goal:   { x: 4, y: 4 },
    direction: 'right',
    fuel: FUEL,
    grid: [
      ['empty', 'empty', 'wall',  'empty', 'empty'],
      ['wall',  'empty', 'wall',  'empty', 'wall' ],
      ['wall',  'empty', 'empty', 'empty', 'empty' ],
      ['wall',  'empty', 'empty', 'wall',  'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
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
