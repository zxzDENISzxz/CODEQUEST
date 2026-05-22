import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetSiel } from '../components/GoalPlanets'

const FUEL = 12;

export const level6: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'wall',  'empty', 'empty', 'goal' ],
      ['empty',  'wall',  'empty', 'wall',  'empty'],
      ['empty',  'empty', 'empty', 'empty', 'empty'],
      ['empty',  'wall',  'empty', 'wall',  'empty'],
      ['empty',  'empty', 'empty', 'empty', 'empty'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 6,
    title: 'Кольца Зура',
    description: 'Ледяные кольца перекрыли прямой путь к Сиэл. Найди обход.',
    hint: `Прямой курс заблокирован. Рекомендую обход через нижний коридор. Топлива: ${FUEL}.`,
    minCommands: 6,
  },
  visual: {
    obstacleTheme: 'ice',
    GoalPlanet: PlanetSiel,
    mapPosition: { x: 63, y: 60 },
    mapColor: { color: '#22d3ee', glow: 'rgba(34,211,238,0.45)' },
  },
}
