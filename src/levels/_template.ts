// ─────────────────────────────────────────────────────────────
// ШАБЛОН УРОВНЯ
//
// Как добавить уровень:
//   1. Скопируй этот файл, назови levelN.ts
//   2. Добавь в index.ts: import { levelN } from './levelN'
//      и levelN в массив levels
// ─────────────────────────────────────────────────────────────

import type { LevelDef } from '../core/types'

// Планеты-цели (импортируй нужную):
// PlanetPixo | PlanetRufa | PlanetTivo | PlanetEmbra
// PlanetNox  | PlanetSiel | PlanetDrax | PlanetAruma
import { PlanetPixo } from '../components/GoalPlanets'

// Панель-подсказка (только для обучающих уровней, иначе не импортируй):
// MoveHintPanel | TurnHintPanel | RepeatHintPanel
// import { MoveHintPanel } from '../components/MoveHintPanel'

export const levelN: LevelDef = {
  state: {
    // Стартовая позиция корабля. x — столбец, y — строка (0,0 = верхний левый угол)
    player: { x: 0, y: 0 },

    // Позиция планеты-цели
    goal: { x: 4, y: 4 },

    // Начальное направление корабля: 'right' | 'left' | 'up' | 'down'
    direction: 'right',

    // Лимит топлива. Каждый move тратит 1 единицу. Кончится — fail.
    fuel: 14,

    // Сетка уровня. 'empty' — пустая клетка, 'wall' — препятствие.
    // grid[строка][столбец]. Размер произвольный, но обычно 5×5.
    grid: [
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'wall',  'empty', 'wall',  'empty'],
      ['empty', 'wall',  'empty', 'empty', 'empty'],
      ['empty', 'wall',  'wall',  'wall',  'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
  },

  meta: {
    // Порядковый номер (отображается в заголовке игры)
    id: 9,

    // Название сектора (отображается в заголовке и тултипе на карте)
    title: 'Название сектора',

    // Лоровое описание (в тултипе на карте при наведении)
    description: 'Описание ситуации от лица БИПП.',

    // Подсказка в панели БИПП во время игры. Поддерживает \n для переносов.
    hint: 'Текст подсказки.\nВторая строка.',

    // Минимальное кол-во команд для получения 3 звёзд.
    // Меньше или равно — 3 звезды, чуть больше — 2, остальное — 1.
    minCommands: 7,
  },

  visual: {
    // Тема препятствий (внешний вид стен):
    // 'nebula'   — цветные туманности
    // 'asteroid' — вращающиеся астероиды
    // 'debris'   — обломки космической станции
    // 'ice'      — ледяные кристаллы
    obstacleTheme: 'asteroid',

    // SVG-компонент планеты-цели (импортируй выше)
    GoalPlanet: PlanetPixo,

    // Позиция ноды на карте секторов в процентах (0–100).
    // x — горизонталь, y — вертикаль. Не накладывай на существующие ноды.
    mapPosition: { x: 60, y: 50 },

    // Цвет ноды на карте. color — основной, glow — свечение (rgba).
    mapColor: { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  },

  // Необязательно. Анимированная панель-подсказка по команде.
  // Показывается только на этом уровне, слева от поля ввода.
  // HintPanel: MoveHintPanel,
}
