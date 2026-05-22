import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetPixo } from '../components/GoalPlanets'
import { MoveHintPanel } from '../components/MoveHintPanel'

const FUEL = 2;

export const level1: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'goal'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 1,
    title: 'Туманность Веги',
    description: 'Зикс входит в первый сектор. Планета Пиксо виднеется вдали.',
    hint: `Топлива: ${FUEL} единицы. Один манёвр — минус одно деление.\nКоманда: move`,
    minCommands: 2,
  },
  visual: {
    obstacleTheme: 'nebula',
    GoalPlanet: PlanetPixo,
    mapPosition: { x: 13, y: 24 },
    mapColor: { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  },
  HintPanel: MoveHintPanel,
}
