import { parseGrid } from '../core/types'
import type { LevelDef } from '../core/types'
import { PlanetDrax } from '../components/GoalPlanets'

const FUEL = 14;

export const level7: LevelDef = {
  state: {
    ...parseGrid([
      ['player', 'empty', 'wall',  'empty', 'empty', 'empty'],
      ['wall',   'empty', 'wall',  'empty', 'wall',  'empty'],
      ['wall',   'empty', 'empty', 'empty', 'wall',  'empty'],
      ['empty',  'empty', 'empty', 'wall',  'empty', 'empty'],
      ['empty',  'wall',  'wall',  'empty', 'empty', 'empty'],
      ['empty',  'empty', 'empty', 'empty', 'wall',  'goal'],
    ]),
    direction: 'right',
    fuel: FUEL,
  },
  meta: {
    id: 7,
    title: 'Сектор Буря',
    description: 'Хаотичное поле обломков. Дракс еле виден сквозь помехи.',
    hint: `Плотность обломков — максимальная. Ищи узкий проход. Топлива: ${FUEL}.`,
    minCommands: 8,
    briefing: `Какая глушь... Вокруг хаотичное поле обломков, сквозь помехи едва видна планета Дракс. Проход очень узкий!\n\nНа таком сложном пути легко ошибиться на одну клеточку или перепутать поворот. Если твой корабль врезался или улетел не туда — не расстраивайся! В программировании это называется баг (ошибка), а процесс её поиска — отладка.\n\nНажми кнопку «Сбросить», пройди по своему коду глазами шаг за шагом, найди, где ракета свернула не туда, исправь команду и попробуй снова! Ты справишься.`,
  },
  visual: {
    obstacleTheme: 'debris',
    GoalPlanet: PlanetDrax,
    mapPosition: { x: 36, y: 67 },
    mapColor: { color: '#ef4444', glow: 'rgba(239,68,68,0.50)' },
  },
}
