import type { LevelDef } from '../core/types'
import { PlanetEmbra } from '../components/GoalPlanets'

const FUEL = 8;

export const level4: LevelDef = {
  state: {
    player: { x: 0, y: 0 },
    goal:   { x: 2, y: 2 },
    direction: 'right',
    fuel: FUEL,
    grid: [
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'wall',  'wall',  'empty', 'empty'],
      ['empty', 'wall',  'empty', 'empty', 'empty'],
      ['empty', 'wall',  'empty', 'wall',  'empty'],
      ['empty', 'empty', 'empty', 'wall',  'empty'],
    ],
  },
  meta: {
    id: 4,
    title: 'Разлом Кеола',
    description: 'Плотный астероидный пояс. Эмбра где-то внутри.',
    hint: `Маршрут неоднозначен. Комбинируй move, turn, repeat.\nТоплива: ${FUEL}.`,
    minCommands: 7,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetEmbra,
    mapPosition: { x: 72, y: 15 },
    mapColor: { color: '#f97316', glow: 'rgba(249,115,22,0.40)' },
  },
}
