import type { ComponentType } from 'react'
import type { GameState } from './GameEngine'

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
