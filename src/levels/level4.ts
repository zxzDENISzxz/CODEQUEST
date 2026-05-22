import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetEmbra } from '../components/GoalPlanets'

const FUEL = 6;

export const level4: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'empty', 'empty'],
      ['empty',  'wall',  'wall',  'empty'],
      ['empty',  'wall',  'goal',  'empty'],
      ['empty',  'empty',  'empty', 'wall'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 4,
    title: 'Разлом Кеола',
    description: 'Плотный астероидный пояс. Эмбра где-то внутри.',
    hint: `Маршрут неоднозначен. Комбинируй move, turn, repeat.\nТоплива: ${FUEL}.`,
    minCommands: 7,
    briefing: `Ого, какой лабиринт из обломков! Здесь одной командой не обойтись. Пришло время стать настоящим архитектором кода.\n\nКомпьютер (и наш корабль) выполняет команды строго сверху вниз, одну за другой. Это называется последовательностью.\n\nТы можешь смело комбинировать наши суперсилы: сначала пролететь вперед с помощью repeat, потом повернуться через turn, а потом снова лететь. Просчитай весь путь в голове, как шахматист, запиши его в свиток команд и нажимай «Запустить»!`,
  },
  visual: {
    obstacleTheme: 'asteroid',
    GoalPlanet: PlanetEmbra,
    mapPosition: { x: 72, y: 15 },
    mapColor: { color: '#eab308', glow: 'rgba(234,179,8,0.50)' },
  },
}
