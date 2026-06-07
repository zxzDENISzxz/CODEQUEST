import type { GameState, Direction, Cell } from './GameEngine'

type Prim = 'M' | 'T'

const DIRS: readonly Direction[] = ['right', 'down', 'left', 'up']

function rotateCW(dir: Direction): Direction {
  return DIRS[(DIRS.indexOf(dir) + 1) % 4]
}

function stepPos(x: number, y: number, dir: Direction): [number, number] {
  switch (dir) {
    case 'right': return [x + 1, y]
    case 'left':  return [x - 1, y]
    case 'down':  return [x, y + 1]
    case 'up':    return [x, y - 1]
  }
}

function isWalkable(x: number, y: number, grid: Cell[][]): boolean {
  return y >= 0 && y < grid.length &&
         x >= 0 && x < grid[0].length &&
         grid[y][x] !== 'wall'
}

// ─── DP-кодирование: минимум команд с учётом repeat ───────────
// Соответствует логике countCommands() в GameEngine.ts:
//   move/turn = 1, repeat = 1 + inner
const encCache = new Map<string, number>()

function encode(seq: Prim[]): number {
  if (seq.length === 0) return 0
  const k = seq.join('')
  const cached = encCache.get(k)
  if (cached !== undefined) return cached

  // Вариант 1: взять первый примитив отдельно
  let best = 1 + encode(seq.slice(1))
  const n = seq.length

  // Вариант 2: найти повтор в начале последовательности
  for (let ul = 1; ul <= (n >> 1); ul++) {
    for (let cnt = 2; cnt * ul <= n; cnt++) {
      let match = true
      for (let i = 0; i < cnt * ul; i++) {
        if (seq[i] !== seq[i % ul]) { match = false; break }
      }
      if (match) {
        // repeat cnt { seq[0..ul-1] } + хвост
        const v = 1 + encode(seq.slice(0, ul)) + encode(seq.slice(cnt * ul))
        if (v < best) best = v
      }
    }
  }

  encCache.set(k, best)
  return best
}

// ─── Построение строки решения из примитивной последовательности ──
function buildStr(seq: Prim[], pad = ''): string {
  if (seq.length === 0) return ''

  let bestCost = 1 + encode(seq.slice(1))
  let bestUl = 0
  let bestCnt = 0
  const n = seq.length

  for (let ul = 1; ul <= (n >> 1); ul++) {
    for (let cnt = 2; cnt * ul <= n; cnt++) {
      let match = true
      for (let i = 0; i < cnt * ul; i++) {
        if (seq[i] !== seq[i % ul]) { match = false; break }
      }
      if (match) {
        const v = 1 + encode(seq.slice(0, ul)) + encode(seq.slice(cnt * ul))
        if (v < bestCost) { bestCost = v; bestUl = ul; bestCnt = cnt }
      }
    }
  }

  if (bestUl === 0) {
    const name = seq[0] === 'M' ? 'move' : 'turn'
    const rest = buildStr(seq.slice(1), pad)
    return rest ? `${pad}${name}\n${rest}` : `${pad}${name}`
  }

  const body = buildStr(seq.slice(0, bestUl), pad + '  ')
  const rest = buildStr(seq.slice(bestUl * bestCnt), pad)
  const block = `${pad}repeat ${bestCnt} {\n${body}\n${pad}}`
  return rest ? `${block}\n${rest}` : block
}

// ─── Публичный интерфейс ──────────────────────────────────────
export interface SolveResult {
  solvable:    boolean
  minMoves:    number   // минимум шагов move = нужное топливо
  minCommands: number   // минимум команд с repeat-упаковкой
  solution:    string   // человекочитаемое решение (для справки)
}

export function solveLevel(state: GameState): SolveResult {
  encCache.clear()

  const { player, goal, grid, direction } = state

  // State key: позиция + направление + кол-во подряд идущих поворотов
  const sk = (x: number, y: number, d: Direction, th: number) =>
    `${x},${y},${d},${th}`

  interface Item {
    x: number; y: number; dir: Direction
    moves: number; prims: number
    seq: Prim[]
    turnsHere: number
  }

  // Visited: (x,y,dir,turnsHere) → минимальные {moves, prims}
  const vis = new Map<string, { moves: number; prims: number }>()

  const canVisit = (x: number, y: number, d: Direction, th: number, moves: number, prims: number): boolean => {
    const k = sk(x, y, d, th)
    const prev = vis.get(k)
    if (prev && (prev.moves < moves || (prev.moves === moves && prev.prims <= prims))) return false
    vis.set(k, { moves, prims })
    return true
  }

  // BFS
  const queue: Item[] = []
  vis.set(sk(player.x, player.y, direction, 0), { moves: 0, prims: 0 })
  queue.push({ x: player.x, y: player.y, dir: direction, moves: 0, prims: 0, seq: [], turnsHere: 0 })

  let minMoves = Infinity
  let bestPrims = Infinity
  let bestSeq: Prim[] = []

  let head = 0
  while (head < queue.length) {
    const item = queue[head++]
    if (item.moves > minMoves) continue

    // Цель достигнута
    if (item.x === goal.x && item.y === goal.y) {
      if (item.moves < minMoves || (item.moves === minMoves && item.prims < bestPrims)) {
        minMoves = item.moves
        bestPrims = item.prims
        bestSeq = item.seq
      }
      continue
    }

    // Поворот (не более 3 подряд — 4-й поворот = полный круг)
    if (item.turnsHere < 3) {
      const nd = rotateCW(item.dir)
      const th = item.turnsHere + 1
      if (canVisit(item.x, item.y, nd, th, item.moves, item.prims + 1)) {
        queue.push({
          x: item.x, y: item.y, dir: nd,
          moves: item.moves, prims: item.prims + 1,
          seq: [...item.seq, 'T'],
          turnsHere: th,
        })
      }
    }

    // Движение вперёд
    const [nx, ny] = stepPos(item.x, item.y, item.dir)
    if (isWalkable(nx, ny, grid)) {
      if (canVisit(nx, ny, item.dir, 0, item.moves + 1, item.prims + 1)) {
        queue.push({
          x: nx, y: ny, dir: item.dir,
          moves: item.moves + 1, prims: item.prims + 1,
          seq: [...item.seq, 'M'],
          turnsHere: 0,
        })
      }
    }
  }

  if (!isFinite(minMoves)) {
    return { solvable: false, minMoves: 0, minCommands: 0, solution: '' }
  }

  const minCommands = encode(bestSeq)
  const solution = buildStr(bestSeq)
  return { solvable: true, minMoves, minCommands, solution }
}
