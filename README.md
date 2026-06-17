# CodeQuest

Образовательная игра-головоломка: пиши команды для навигационной системы корабля и веди пилота Зикса через 8 космических секторов домой.

**[Играть онлайн →](https://zxzdeniszxz.github.io/CODEQUEST/)**

## Стек

- **React 19** + **TypeScript**
- **Vite** — сборка
- **Tailwind CSS v4** — стили
- **Framer Motion** — анимации
- **Zustand** — хранение прогресса (localStorage)

## Запуск

```bash
npm install
npm run dev
```

Сборка для продакшена:

```bash
npm run build
npm run preview
```

Деплой на GitHub Pages:

```bash
npm run deploy
```

## Как играть

Вводи команды в текстовое поле и нажимай **Запустить**. Корабль выполняет их по очереди. Цель — добраться до планеты, не потратив всё топливо и не врезавшись в препятствие.

| Команда | Действие |
|---|---|
| `move` | шаг вперёд |
| `turn` | поворот на 90° по часовой стрелке |
| `repeat N { }` | повторить N раз команды в скобках |

**Звёзды** начисляются за эффективность: чем меньше команд — тем больше звёзд.

| Результат | Условие |
|---|---|
| ⭐⭐⭐ 3 звезды | команд ≤ `minCommands` |
| ⭐⭐ 2 звезды | команд ≤ `minCommands × 1.5` |
| ⭐ 1 звезда | любое прохождение |
| 🧠 Гений | команд меньше, чем в оптимальном решении игры |

## Структура проекта

```
src/
├── core/
│   ├── GameEngine.ts       # игровой движок: выполнение команд, события
│   ├── CommandParser.ts    # парсер текста в команды
│   ├── sounds.ts           # синтез звуков через Web Audio API (без файлов)
│   └── types.ts            # общие типы (LevelDef, LevelMeta, LevelVisual) + parseGrid
│
├── levels/
│   ├── _template.ts        # шаблон для нового уровня (с комментариями)
│   ├── index.ts            # массив всех уровней
│   ├── level1.ts           # Туманность Веги
│   ├── level2.ts           # Пояс Дарна
│   ├── level3.ts           # Облако Скрай
│   ├── level4.ts           # Разлом Кеола
│   ├── level5.ts           # Серая зона
│   ├── level6.ts           # Кольца Зура
│   ├── level7.ts           # Сектор Буря
│   └── level8.ts           # Родной сектор
│
├── components/
│   ├── GameGrid.tsx         # игровая сетка с кораблём и препятствиями
│   ├── LevelSelect.tsx      # карта секторов с нодами
│   ├── CommandInput.tsx     # текстовое поле с подсветкой текущей строки
│   ├── GoalPlanets.tsx      # SVG-компоненты планет-целей (8 штук)
│   ├── BippMessage.tsx      # панель подсказок от ИИ БИПП (кликабелен → открывает брифинг)
│   ├── BippBriefing.tsx     # модальное окно брифинга с эффектом печатной машинки
│   ├── CommandCounter.tsx   # счётчик команд и звёзды
│   ├── FinalScreen.tsx      # финальный экран после прохождения игры
│   ├── StarBackground.tsx   # анимированный звёздный фон
│   ├── MoveHintPanel.tsx    # обучающая панель для команды move
│   ├── TurnHintPanel.tsx    # обучающая панель для команды turn
│   └── RepeatHintPanel.tsx  # обучающая панель для команды repeat
│
├── store/
│   └── gameStore.ts         # Zustand: победы, коды, звёзды, просмотренные брифинги
│
├── data/
│   └── solutions.json       # оптимальные решения для всех уровней (minMoves, minCommands)
│
└── App.tsx                  # корневой компонент, игровой цикл
```

## Добавить уровень

1. Скопируй `src/levels/_template.ts` → `src/levels/level9.ts`
2. Заполни поля (все описаны в шаблоне)
3. В `src/levels/index.ts` добавь:

```ts
import { level9 } from './level9'

export const levels: LevelDef[] = [..., level9]
```

4. Запусти `npm run solve` — скрипт пересчитает оптимальные решения и обновит `solutions.json` (от него берётся лимит топлива)

Всё остальное (карта, навигация, звёзды) подхватится автоматически.

### Структура уровня

```ts
import { parseGrid } from '../core/types'
import { PlanetPixo } from '../components/GoalPlanets'
import { MoveHintPanel } from '../components/MoveHintPanel' // только для обучающих уровней

export const level9: LevelDef = {
  state: {
    // parseGrid принимает «сырую» сетку с маркерами 'player' и 'goal' прямо в клетках.
    // Функция извлекает их позиции и возвращает { player, goal, grid }.
    ...parseGrid([
      ['player', 'wall',  'goal'  ],
      ['empty',  'wall',  'empty' ],
      ['empty',  'empty', 'empty' ],
    ]),
    // Начальное направление: 'right' | 'left' | 'up' | 'down'
    direction: 'right',
    // fuel здесь не указывается — App.tsx берёт его из solutions.json (поле minMoves)
  },
  meta: {
    id: 9,
    title: 'Название сектора',
    description: 'Описание ситуации (тултип на карте).',
    hint: 'Подсказка от БИПП в игре.\nВторая строка.',
    briefing: 'Текст брифинга при первом входе.',  // необязательно
    minCommands: 7,  // порог для 3 звёзд; необязательно (без него звёзды не считаются)
  },
  visual: {
    obstacleTheme: 'asteroid',            // 'nebula' | 'asteroid' | 'debris' | 'ice'
    GoalPlanet: PlanetPixo,               // компонент из GoalPlanets.tsx
    mapPosition: { x: 60, y: 50 },       // позиция ноды на карте (0–100%)
    mapColor: { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },
  },
  HintPanel: MoveHintPanel,  // необязательно: панель-подсказка для обучающих уровней
}
```

## Утилиты разработки

```bash
npm run solve   # пересчитать оптимальные решения → src/data/solutions.json
npm run lint    # проверить стиль кода
```

## Звуковая система

Все звуки синтезируются через **Web Audio API** — никаких аудиофайлов, никаких зависимостей. Модуль `src/core/sounds.ts` экспортирует:

| Функция | Когда вызывается |
|---|---|
| `startThruster()` / `stopThruster()` | в начале и конце анимации движения |
| `playTurn()` | при каждом событии `turn` |
| `playWin()` | при победе |
| `playFail()` | при столкновении / нехватке топлива |
| `playClick()` | при клике на кнопки интерфейса |
| `playBippSpeak()` | во время печатной машинки в брифинге |
| `playLanding()` / `playArrival()` | на финальном экране |
| `setMuted(bool)` | кнопка 🔇/🔊 в правом углу |

## Архитектура движка

Движок (`GameEngine.ts`) работает без React: принимает `GameState` и массив `Command[]`, возвращает список событий `GameEvent[]` и финальное состояние. `App.tsx` воспроизводит события с интервалом 300 мс, обновляя позицию корабля на экране.

```
parseCommands(text) → Command[]
runCommands(state, commands) → { events, finalState }
App.tsx воспроизводит events → анимация
```

Это позволяет тестировать логику уровней без браузера — см. `src/core/GameEngine.test.ts`.
