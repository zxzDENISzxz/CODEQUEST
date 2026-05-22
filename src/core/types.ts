import type { ComponentType } from 'react'
import type { GameState, Position, Cell } from './GameEngine'

export type RawCell = 'empty' | 'wall' | 'player' | 'goal'

export function parseGrid(rawGrid: RawCell[][]): { player: Position; goal: Position; grid: Cell[][] } {
  let player: Position = { x: 0, y: 0 }
  let goal: Position = { x: 0, y: 0 }
  const grid: Cell[][] = rawGrid.map((row, y) =>
    row.map((cell, x): Cell => {
      if (cell === 'player') { player = { x, y }; return 'empty' }
      if (cell === 'goal')   { goal   = { x, y }; return 'empty' }
      return cell as Cell
    })
  )
  return { player, goal, grid }
}

export type ObstacleTheme = 'nebula' | 'asteroid' | 'debris' | 'ice'

export interface LevelMeta {
  id: number
  title: string
  description: string
  hint: string
  minCommands: number
}

export interface LevelVisual {
  obstacleTheme: ObstacleTheme
  GoalPlanet: ComponentType
  mapPosition: { x: number; y: number }
  mapColor: { color: string; glow: string }
}

export interface LevelDef {
  state: GameState
  meta: LevelMeta
  visual: LevelVisual
  HintPanel?: ComponentType
}
