import { useState } from 'react'
import { GameGrid } from './components/GameGrid'
import { CommandInput } from './components/CommandInput'
import { parseCommands } from './core/CommandParser'
import { runCommands } from './core/GameEngine'
import type { GameState } from './core/GameEngine'
import { levels } from './levels/index'

const initialState: GameState = levels[0].state
const meta = levels[0].meta

export default function App() {
  const [state, setState] = useState<GameState>(initialState)

  function handleRun(code: string) {
    const parsed = parseCommands(code)
    if (!parsed.ok) {
      alert(`Ошибка в строке ${parsed.line}: ${parsed.error}`)
      return
    }
    const next = runCommands(state, parsed.commands)
    setState(next)
  }

  function handleReset() {
    setState({ ...initialState, status: 'idle', steps: [] })
  }

  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col items-center justify-center gap-8 p-8">

      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400">CodeQuest 🚀</h1>
        <p className="text-indigo-300 mt-1">Уровень {meta.id} — {meta.title}</p>
        <p className="text-indigo-400 text-sm mt-1">{meta.description}</p>
      </div>

      {/* Игровая область */}
      <div className="flex gap-12 items-start">
        <div className="flex flex-col gap-4">
          <GameGrid
            grid={state.grid}
            player={state.player}
            goal={state.goal}
          />

          {/* Статус */}
          {state.status === 'win' && (
            <div className="text-center text-2xl font-bold text-green-400">
              🎉 Победа!
            </div>
          )}
          {state.status === 'fail' && (
            <div className="text-center text-2xl font-bold text-red-400">
              💥 Попробуй ещё раз!
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-indigo-300 text-sm">💡 {meta.hint}</p>
          <CommandInput
            onRun={handleRun}
            disabled={state.status === 'win'}
          />
          <button
            onClick={handleReset}
            className="py-2 rounded-lg text-indigo-400 hover:text-white transition-colors cursor-pointer"
          >
            🔄 Сбросить
          </button>
        </div>
      </div>
    </div>
  )
}