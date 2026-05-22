import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetRufa } from '../components/GoalPlanets'
import { TurnHintPanel } from '../components/TurnHintPanel'

const FUEL = 16;

export const level2: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'wall',  'empty', 'empty', 'goal' ],
      ['empty',  'wall',  'empty', 'wall',  'wall' ],
      ['empty',  'wall',  'empty', 'empty', 'empty'],
      ['empty',  'wall',  'wall',  'wall',  'empty'],
      ['empty',  'empty', 'empty', 'empty', 'empty'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 2,
    title: 'Пояс Дарна',
    description: 'Первые астероиды. Прямой курс на Руфу заблокирован.',
    hint: `Препятствия обнаружены. turn — поворот 90°. move — манёвр.\nТоплива: ${FUEL}.`,
    minCommands: 14,
  },
  visual: {
    obstacleTheme: 'asteroid',
    GoalPlanet: PlanetRufa,
    mapPosition: { x: 32, y: 14 },
    mapColor: { color: '#fb923c', glow: 'rgba(251,146,60,0.45)' },
  },
  HintPanel: TurnHintPanel,
}
