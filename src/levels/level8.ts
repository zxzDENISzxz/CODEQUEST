import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetAruma } from '../components/GoalPlanets'

export const level8: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'  ],
      ['empty',  'empty', 'wall',  'wall',  'empty', 'empty', 'empty' ],
      ['empty',  'wall',  'goal',  'empty', 'wall',  'empty', 'empty' ],
      ['empty',  'empty', 'wall',  'empty', 'empty', 'empty', 'wall'  ],
      ['empty',  'wall',  'empty', 'wall',  'wall',  'empty', 'empty' ],
      ['empty',  'empty', 'wall',  'empty', 'empty', 'wall',  'empty' ],
      ['wall',   'empty', 'empty', 'empty', 'empty', 'empty', 'empty' ],
    ]),
    direction: 'right',
  },
  meta: {
    id: 8,
    title: 'Родной сектор',
    description: 'Последний переход. Арума ждёт. БИПП мигает тише обычного.',
    hint: `...Арума... ...вперёд...`,
    briefing: `...Прием... Капитан... Топлива почти не осталось, БИПП мигает тише обычного... Но мы у самой цели! Впереди Арума — наш дом!\n\nЗдесь нет новых инструкций, потому что ты уже умеешь всё, что нужно. Ты знаешь, как двигаться, как поворачивать и как заставлять циклы работать на себя.\n\nПосмотри на эту гигантскую карту. Напиши самый красивый, компактный и точный алгоритм в твоей жизни. Возвращай нас домой, Капитан!`,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetAruma,
    mapPosition: { x: 54, y: 82 },
    mapColor: { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  },
}
