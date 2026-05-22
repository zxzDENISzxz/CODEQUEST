import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetTivo } from '../components/GoalPlanets'
import { RepeatHintPanel } from '../components/RepeatHintPanel'

const FUEL = 3;

export const level3: LevelDef = {
  state: {
    ...parseGrid([
      ['empty',  'empty', 'empty',  'wall'],
      ['wall',   'empty', 'wall',  'empty'],
      ['player', 'empty', 'empty', 'goal' ],
      ['empty',  'wall',  'empty',  'wall'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 3,
    title: 'Облако Скрай',
    description: 'Открытое пространство. Путь до Тиво — длинный.',
    hint: `Повторяющиеся манёвры детектированы. Рекомендую:\nrepeat N {\n  move\n}\nТоплива: ${FUEL}.`,
    minCommands: 2,
    briefing: `Космос становится огромным! До планеты Тиво лететь и лететь. Мы, конечно, можем написать move много-много раз подряд... Но программисты — люди ленивые (в хорошем смысле!), они не любят писать одно и то же.\n\nДля этого придумали циклы — команду repeat (повторить).\nВместо того чтобы писать:\nmove\nmove\nmove\n\nМы можем приказать роботу: repeat 3 { move }. Это значит: «Повтори то, что в скобках, ровно 3 раза». Круто? Это экономит наше топливо и время!`,
  },
  visual: {
    obstacleTheme: 'nebula',
    GoalPlanet: PlanetTivo,
    mapPosition: { x: 53, y: 22 },
    mapColor: { color: '#c084fc', glow: 'rgba(192,132,252,0.50)' },
  },
  HintPanel: RepeatHintPanel,
}
