import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetPixo } from '../components/GoalPlanets'
import { MoveHintPanel } from '../components/MoveHintPanel'

export const level1: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'goal'],
    ]),
    direction: 'right',
  },
  meta: {
    id: 1,
    title: 'Туманность Веги',
    description: 'Зикс входит в первый сектор. Планета Пиксо виднеется вдали.',
    hint: `Один манёвр — минус одно деление топлива.\nКоманда: move`,
    briefing: `Привет, Капитан! Я твой бортовой робот-помощник БИПП. Наш корабль застрял в космосе, а до планеты Пиксо рукой подать. Но вот беда: автопилот сломался!\n\nЧтобы сдвинуть ракету с места, нам нужно составить алгоритм. Алгоритм — это просто четкий план действий или рецепт. Наш корабль слушается только точных команд.\n\nДавай отдадим ему команду move (в переводе с английского — «двигаться»). Один move — это ровно один шаг (одна клетка) вперед по курсу. Напиши команду, и полетели!`,
  },
  visual: {
    obstacleTheme: 'nebula',
    GoalPlanet: PlanetPixo,
    mapPosition: { x: 13, y: 24 },
    mapColor: { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  },
  HintPanel: MoveHintPanel,
}
