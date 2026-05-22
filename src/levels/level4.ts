import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetEmbra } from '../components/GoalPlanets'

const FUEL = 6;

export const level4: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'empty', 'empty'],
      ['empty',  'wall',  'wall',  'empty'],
      ['empty',  'wall',  'goal',  'empty'],
      ['empty',  'empty',  'empty', 'wall'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 4,
    title: 'Разлом Кеола',
    description: 'Плотный астероидный пояс. Эмбра где-то внутри.',
    hint: `Маршрут неоднозначен. Комбинируй move, turn, repeat.\nТоплива: ${FUEL}.`,
    minCommands: 7,
  },
  visual: {
    obstacleTheme: 'asteroid',
    GoalPlanet: PlanetEmbra,
    mapPosition: { x: 72, y: 15 },
    mapColor: { color: '#f97316', glow: 'rgba(249,115,22,0.40)' },
  },
}
