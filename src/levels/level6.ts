import type { LevelDef } from '../core/types'
import { PlanetSiel } from '../components/GoalPlanets'

export const level6: LevelDef = {
  state: {
    player: { x: 0, y: 0 },
    goal:   { x: 4, y: 0 },
    direction: 'right',
    fuel: 14,
    grid: [
      ['empty', 'wall',  'empty', 'empty', 'empty'],
      ['empty', 'wall',  'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
  },
  meta: {
    id: 6,
    title: 'Кольца Зура',
    description: 'Ледяные кольца перекрыли прямой путь к Сиэл. Найди обход.',
    hint: 'Прямой курс заблокирован. Рекомендую обход через нижний коридор. Топлива: 14.',
    minCommands: 11,
  },
  visual: {
    obstacleTheme: 'ice',
    GoalPlanet: PlanetSiel,
    mapPosition: { x: 63, y: 60 },
    mapColor: { color: '#22d3ee', glow: 'rgba(34,211,238,0.45)' },
  },
}
