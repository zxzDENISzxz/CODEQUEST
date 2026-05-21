import type { LevelDef } from '../core/types'
import { PlanetPixo } from '../components/GoalPlanets'
import { MoveHintPanel } from '../components/MoveHintPanel'

export const level1: LevelDef = {
  state: {
    player: { x: 0, y: 0 },
    goal:   { x: 4, y: 0 },
    direction: 'right',
    fuel: 4,
    grid: [
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
  },
  meta: {
    id: 1,
    title: 'Туманность Веги',
    description: 'Зикс входит в первый сектор. Планета Пиксо виднеется вдали.',
    hint: 'Топлива: 4 единицы. Один манёвр — минус одно деление.\nКоманда: move',
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
