import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetRufa } from '../components/GoalPlanets'
import { TurnHintPanel } from '../components/TurnHintPanel'

export const level2: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'wall',  'goal'  ],
      ['empty',  'wall',  'empty' ],
      ['empty',  'empty', 'empty' ],
    ]),
    direction: 'right',
  },
  meta: {
    id: 2,
    title: 'Пояс Дарна',
    description: 'Первые астероиды. Прямой курс на Руфу заблокирован.',
    hint: `Препятствия обнаружены. turn — поворот 90°. move — манёвр.`,
    briefing: `Ух ты, впереди астероиды! Прямой путь заблокирован, придется маневрировать.\n\nНаш корабль умеет летать только туда, куда смотрит его нос. Чтобы изменить направление, используй команду turn (поворот). Запомни: каждый turn разворачивает ракету направо (по часовой стрелке).\n\nЕсли нужно повернуть направо — пишем turn 1 раз.\n\nЕсли нужно развернуться назад — пишем turn 2 раза.\n\nА если нужно повернуть налево? Подумай... Правильно, нужно повернуться три раза направо: turn, turn, turn!\n\nСначала поверни корабль в нужную сторону, а потом лети!`,
  },
  visual: {
    obstacleTheme: 'asteroid',
    GoalPlanet: PlanetRufa,
    mapPosition: { x: 32, y: 14 },
    mapColor: { color: '#fb923c', glow: 'rgba(251,146,60,0.45)' },
  },
  HintPanel: TurnHintPanel,
}
