import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetSiel } from '../components/GoalPlanets'

export const level6: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'wall',  'empty', 'empty', 'goal' ],
      ['empty',  'wall',  'empty', 'wall',  'empty'],
      ['empty',  'empty', 'empty', 'empty', 'empty'],
      ['empty',  'wall',  'empty', 'wall',  'empty'],
      ['empty',  'empty', 'empty', 'empty', 'empty'],
    ]),
    direction: 'right',
  },
  meta: {
    id: 6,
    title: 'Кольца Зура',
    description: 'Ледяные кольца перекрыли прямой путь к Сиэл. Найди обход.',
    hint: `Прямой курс заблокирован. Ищи повторяющийся манёвр и упакуй в repeat.`,
    briefing: `Ледяные глыбы перекрыли дорогу к Сиэлу! Напрямик не пройти, но я вижу нижний коридор. Он длинный, но безопасный.\n\nНа этом уровне топливо ограничено, а путь будет состоять из повторяющихся маневров. Внимательно посмотри на карту и найди повторяющийся узор (паттерн). Если ты заметишь, что корабль должен делать одни и те же повороты и шаги несколько раз подряд — смело упаковывай весь этот узор в цикл repeat. Мысли глобально!`,
  },
  visual: {
    obstacleTheme: 'ice',
    GoalPlanet: PlanetSiel,
    mapPosition: { x: 63, y: 60 },
    mapColor: { color: '#22d3ee', glow: 'rgba(34,211,238,0.45)' },
  },
}
