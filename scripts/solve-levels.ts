// Запуск: npm run solve
// Автоматически находит все src/levels/level*.ts файлы.
// Результат → src/data/solutions.json

import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { solveLevel } from '../src/core/solver.ts'
import type { GameState } from '../src/core/GameEngine.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const root       = resolve(__dirname, '..')
const levelsDir  = resolve(root, 'src/levels')

// Авто-обнаружение: все level*.ts по порядку
const levelFiles = readdirSync(levelsDir)
  .filter(f => /^level\d+\.ts$/.test(f))
  .sort((a, b) => {
    const n = (s: string) => parseInt(s.match(/\d+/)![0])
    return n(a) - n(b)
  })

console.log('CodeQuest Solver\n' + '─'.repeat(44))
console.log(`Найдено уровней: ${levelFiles.length}`)

interface LevelLike { state: GameState; meta: { id: number; title: string } }

const solutions = []
for (const file of levelFiles) {
  const mod = await import(`../src/levels/${file}`) as Record<string, unknown>

  // Ищем экспорт с .state и .meta (это и есть LevelDef)
  const levelDef = Object.values(mod).find(
    v => v !== null && typeof v === 'object' && 'state' in (v as object) && 'meta' in (v as object)
  ) as LevelLike | undefined

  if (!levelDef) { console.warn(`  Пропущен ${file} — не найден экспорт LevelDef`); continue }

  const { state, meta } = levelDef
  const result = solveLevel(state)
  const status  = result.solvable ? '✓' : '✗ UNSOLVABLE'

  console.log(`\nLevel ${meta.id} — ${meta.title}  ${status}`)
  if (result.solvable) {
    console.log(`  minMoves:    ${result.minMoves}`)
    console.log(`  minCommands: ${result.minCommands}`)
    console.log('  Решение:')
    result.solution.split('\n').forEach(line => console.log('    ' + line))
  }

  solutions.push({
    levelId:     meta.id,
    minMoves:    result.minMoves,
    minCommands: result.minCommands,
    solution:    result.solution,
  })
}

solutions.sort((a, b) => a.levelId - b.levelId)

const outDir = resolve(root, 'src/data')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'solutions.json'), JSON.stringify(solutions, null, 2) + '\n')

console.log('\n' + '─'.repeat(44))
console.log(`Сохранено → src/data/solutions.json`)
