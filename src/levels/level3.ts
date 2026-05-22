import type { LevelDef } from '../core/types'
import { PlanetTivo } from '../components/GoalPlanets'
import { RepeatHintPanel } from '../components/RepeatHintPanel'

const FUEL = 4;

export const level3: LevelDef = {
  state: {
    player: { x: 0, y: 2 },
    goal:   { x: 4, y: 2 },
    direction: 'right',
    fuel: FUEL,
    grid: [
      ['empty', 'wall', 'empty', 'wall', 'empty'],
      ['wall', 'empty', 'wall', 'empty', 'wall'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'wall', 'empty', 'wall', 'empty'],
      ['wall', 'empty', 'wall', 'empty', 'wall'],
    ],
  },
  meta: {
    id: 3,
    title: 'Облако Скрай',
    description: 'Открытое пространство. Путь до Тиво — длинный.',
    hint: `Повторяющиеся манёвры детектированы. Рекомендую:\nrepeat N {\n  move\n}\nТоплива: ${FUEL}.`,
    minCommands: 2,
  },
  visual: {
    obstacleTheme: 'nebula',
    GoalPlanet: PlanetTivo,
    mapPosition: { x: 53, y: 22 },
    mapColor: { color: '#c084fc', glow: 'rgba(192,132,252,0.50)' },
  },
  HintPanel: RepeatHintPanel,
}
