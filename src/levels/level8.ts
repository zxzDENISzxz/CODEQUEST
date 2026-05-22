import type { LevelDef } from '../core/types'
import { PlanetAruma } from '../components/GoalPlanets'

const FUEL = 8;

export const level8: LevelDef = {
  state: {
    player: { x: 0, y: 0 },
    goal:   { x: 4, y: 4 },
    direction: 'right',
    fuel: FUEL,
    grid: [
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'wall',  'wall',  'wall',  'empty'],
      ['empty', 'wall',  'empty', 'wall',  'empty'],
      ['empty', 'empty', 'empty', 'wall',  'empty'],
      ['empty', 'wall', 'empty', 'empty', 'empty'],
    ],
  },
  meta: {
    id: 8,
    title: 'Родной сектор',
    description: 'Последний переход. Арума ждёт. БИПП мигает тише обычного.',
    hint: `...Арума... топлива: ${FUEL}... ...вперёд...`,
    minCommands: 4,
  },
  visual: {
    obstacleTheme: 'asteroid',
    GoalPlanet: PlanetAruma,
    mapPosition: { x: 54, y: 82 },
    mapColor: { color: '#fbbf24', glow: 'rgba(251,191,36,0.55)' },
  },
}
