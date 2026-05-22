import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetAruma } from '../components/GoalPlanets'

const FUEL = 8;

export const level8: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall' ],
      ['empty',  'empty', 'wall',  'wall',  'empty', 'empty', 'empty'],
      ['empty',  'wall',  'goal',  'empty', 'wall',  'empty', 'empty'],
      ['empty',  'empty', 'wall',  'empty', 'empty', 'empty', 'wall' ],
      ['empty',  'wall',  'empty', 'wall',  'wall',  'empty', 'empty'],
      ['empty',  'empty', 'wall',  'empty', 'empty', 'wall',  'empty'],
      ['wall',   'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 8,
    title: 'Родной сектор',
    description: 'Последний переход. Арума ждёт. БИПП мигает тише обычного.',
    hint: `...Арума... топлива: ${FUEL}... ...вперёд...`,
    minCommands: 4,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetAruma,
    mapPosition: { x: 54, y: 82 },
    mapColor: { color: '#fbbf24', glow: 'rgba(251,191,36,0.55)' },
  },
}
