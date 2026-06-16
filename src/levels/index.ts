import type { LevelDef } from '../core/types'
import { level1 } from './level1'
import { level2 } from './level2'
import { level3 } from './level3'
import { level4 } from './level4'
import { level5 } from './level5'
import { level6 } from './level6'
import { level7 } from './level7'
import { level8 } from './level8'
import solutions from '../data/solutions.json'

export const levels: LevelDef[] = [level1, level2, level3, level4, level5, level6, level7, level8]

export interface LevelSolution {
  levelId:     number
  minMoves:    number
  minCommands: number
  solution:    string
}

const solutionMap = new Map<number, LevelSolution>(
  (solutions as LevelSolution[]).map(s => [s.levelId, s])
)

export function getLevelSolution(levelId: number): LevelSolution {
  const s = solutionMap.get(levelId)
  if (!s) throw new Error(`No solution for level ${levelId}`)
  return s
}
