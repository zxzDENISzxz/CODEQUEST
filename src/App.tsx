import { useState, useRef, useEffect } from 'react'
import { StarBackground } from './components/StarBackground'
import { GameGrid } from './components/GameGrid'
import { CommandInput } from './components/CommandInput'
import { BippMessage } from './components/BippMessage'
import { FinalScreen } from './components/FinalScreen'
import { LevelSelect } from './components/LevelSelect'
import { CommandCounter, calcStars } from './components/CommandCounter'
import { parseCommands } from './core/CommandParser'
import { runCommands, countCommands } from './core/GameEngine'
import { levels } from './levels/index'
import { useGameStore } from './store/gameStore'
import type { GameState, Position, Direction, GameEvent } from './core/GameEngine'

export default function App() {
  const [screen, setScreen] = useState<'select' | 'game'>('select')
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const { levelWins, levelCodes, levelStars, setWin, setStars } = useGameStore()

  const [currentFuel, setCurrentFuel] = useState<number>(levels[0].meta.fuel)

  const [state, setState] = useState<GameState>({
    ...levels[0].state,
    status: 'idle',
    steps: [],
  })
  const [displayPos, setDisplayPos] = useState<Position>(levels[0].state.player)
  const [currentDirection, setCurrentDirection] = useState<Direction>('right')
  const [animating, setAnimating] = useState(false)
  const [visibleStatus, setVisibleStatus] = useState<'idle' | 'win' | 'fail'>('idle')
  const [teleporting, setTeleporting] = useState(false)
  const [activeCommandIndex, setActiveCommandIndex] = useState<number | null>(null)
  const [lastCommandCount, setLastCommandCount] = useState<number | null>(null)
  const animationRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const launchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [failedCommandIndex, setFailedCommandIndex] = useState<number | null>(null)
  const [lineExecCounts, setLineExecCounts] = useState<Record<number, number>>({})
  const [showFinalScreen, setShowFinalScreen] = useState(false)
  const freshWinRef = useRef(false)

  useEffect(() => {
    if (visibleStatus === 'win' && currentLevelIndex === levels.length - 1 && !animating && freshWinRef.current) {
      freshWinRef.current = false
      const t = setTimeout(() => setShowFinalScreen(true), 1400)
      return () => clearTimeout(t)
    }
  }, [visibleStatus, currentLevelIndex, animating])

  function getLevelState(index: number): GameState {
    return {
      ...levels[index].state,
      status: levelWins[index] ? 'win' : 'idle',
      steps: [],
      fuel: levels[index].meta.fuel,
    }
  }

  function playEvents(events: GameEvent[], finalState: GameState) {
    if (events.length === 0) {
      setVisibleStatus(finalState.status as 'idle' | 'win' | 'fail')
      return
    }

    animationRef.current = true
    setAnimating(true)
    setVisibleStatus('idle')

    let i = 0
    intervalRef.current = setInterval(() => {
      const event = events[i]

      if (event.type === 'move') {
        setDisplayPos(event.position)
        setActiveCommandIndex(event.commandIndex)
        setLineExecCounts(prev => ({ ...prev, [event.commandIndex]: (prev[event.commandIndex] ?? 0) + 1 }))
        setCurrentFuel(event.fuelRemaining)
      }

      if (event.type === 'turn') {
        setCurrentDirection(event.direction)
        setActiveCommandIndex(event.commandIndex)
        setLineExecCounts(prev => ({ ...prev, [event.commandIndex]: (prev[event.commandIndex] ?? 0) + 1 }))
      }

      if (event.type === 'fail' && event.commandIndex >= 0) {
        setFailedCommandIndex(event.commandIndex)
      }

      if (event.type === 'win' || event.type === 'fail') {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        animationRef.current = false
        setAnimating(false)
        setActiveCommandIndex(null)
        setVisibleStatus(finalState.status as 'idle' | 'win' | 'fail')
        return
      }

      i++
      if (i >= events.length) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        animationRef.current = false
        setAnimating(false)
        setActiveCommandIndex(null)
        setVisibleStatus(finalState.status as 'idle' | 'win' | 'fail')
      }
    }, 300)
  }

  const currentLevel = levels[currentLevelIndex]
  const meta = currentLevel.meta
  const currentCode = levelCodes[currentLevelIndex] ?? ''

  function handleCodeChange(code: string) {
    useGameStore.getState().setCode(currentLevelIndex, code)
  }

  function handleRun(code: string) {
    handleCodeChange(code)
    const parsed = parseCommands(code)
    if (parsed.ok === false) {
      alert(`Ошибка в строке ${parsed.line}: ${parsed.error}`)
      return
    }

    const startPos = levels[currentLevelIndex].state.player
    const isAtStart = displayPos.x === startPos.x && displayPos.y === startPos.y

    const launch = () => {
      setDisplayPos(startPos)
      setCurrentDirection(levels[currentLevelIndex].state.direction)
      setVisibleStatus('idle')
      setActiveCommandIndex(null)
      setFailedCommandIndex(null)
      setLineExecCounts({})
      setCurrentFuel(levels[currentLevelIndex].meta.fuel)

      setTimeout(() => {
        setTeleporting(false)

        const freshState: GameState = {
          ...levels[currentLevelIndex].state,
          status: 'idle',
          steps: [],
          fuel: levels[currentLevelIndex].meta.fuel,
        }

        const { events, finalState } = runCommands(freshState, parsed.commands)
        const count = countCommands(parsed.commands)
        setLastCommandCount(count)
        setState(finalState)

        if (finalState.status === 'win') {
          setWin(currentLevelIndex)
          setStars(currentLevelIndex, calcStars(count, meta.minCommands))
          if (currentLevelIndex === levels.length - 1) freshWinRef.current = true
        }

        playEvents(events, finalState)
      }, 50)
    }

    if (isAtStart) {
      launch()
    } else {
      setTeleporting(true)
      launchTimeoutRef.current = setTimeout(launch, 400)
    }
  }

  function handleReset() {
    if (launchTimeoutRef.current) {
      clearTimeout(launchTimeoutRef.current)
      launchTimeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    animationRef.current = false
    setAnimating(false)
    setTeleporting(false)
    setVisibleStatus('idle')
    setActiveCommandIndex(null)
    setCurrentDirection(levels[currentLevelIndex].state.direction)
    setDisplayPos(levels[currentLevelIndex].state.player)
    setState({ ...levels[currentLevelIndex].state, status: 'idle', steps: [], fuel: levels[currentLevelIndex].meta.fuel })
    setCurrentFuel(levels[currentLevelIndex].meta.fuel)
    setLastCommandCount(null)
    setFailedCommandIndex(null)
    setLineExecCounts({})
    setShowFinalScreen(false)
    freshWinRef.current = false
  }

  function handleNextLevel() {
    const nextIndex = currentLevelIndex + 1
    if (nextIndex < levels.length) {
      setVisibleStatus(levelWins[nextIndex] ? 'win' : 'idle')
      setCurrentLevelIndex(nextIndex)
      setState(getLevelState(nextIndex))
      setDisplayPos(levels[nextIndex].state.player)
      setCurrentDirection(levels[nextIndex].state.direction)
      setCurrentFuel(levels[nextIndex].meta.fuel)
      setActiveCommandIndex(null)
      setLastCommandCount(null)
      setLineExecCounts({})
      setFailedCommandIndex(null)
    }
  }

  function handlePreviousLevel() {
    const prevIndex = currentLevelIndex - 1
    if (prevIndex >= 0) {
      setVisibleStatus(levelWins[prevIndex] ? 'win' : 'idle')
      setCurrentLevelIndex(prevIndex)
      setState(getLevelState(prevIndex))
      setDisplayPos(levels[prevIndex].state.player)
      setCurrentDirection(levels[prevIndex].state.direction)
      setCurrentFuel(levels[prevIndex].meta.fuel)
      setActiveCommandIndex(null)
      setLastCommandCount(null)
      setLineExecCounts({})
      setFailedCommandIndex(null)
    }
  }

  if (screen === 'select') {
    return (
      <LevelSelect
        levels={levels}
        levelWins={levelWins}
        levelStars={levelStars}
        onSelect={(index) => {
          setCurrentLevelIndex(index)
          setState(getLevelState(index))
          setDisplayPos(levels[index].state.player)
          setCurrentDirection(levels[index].state.direction)
          setVisibleStatus(levelWins[index] ? 'win' : 'idle')
          setCurrentFuel(levels[index].meta.fuel)
          setActiveCommandIndex(null)
          setLastCommandCount(null)
          setLineExecCounts({})
          setFailedCommandIndex(null)
          setScreen('game')
        }}
      />
    )
  }

  return (
    <>
    <div className="relative min-h-screen text-white flex flex-col items-center gap-8 p-8 pt-12" style={{ background: '#05060f' }}>
      <StarBackground />

      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400">CodeQuest 🚀</h1>
        <p className="text-indigo-300 mt-1">Сектор {meta.id} — {meta.title}</p>
        <p className="text-indigo-400 text-sm mt-1">{meta.description}</p>
      </div>

      <div className="flex gap-12 items-start">
        <div className="flex flex-col gap-4">
          <GameGrid
            grid={state.grid}
            player={displayPos}
            goal={state.goal}
            teleporting={teleporting}
            direction={currentDirection}
            levelIndex={currentLevelIndex}
          />
          <div className="flex items-center gap-2 text-sm font-mono">
            <span>⛽</span>
            <span className="text-indigo-300">Топливо:</span>
            <span className={`font-bold ${currentFuel <= 2 ? 'text-red-400' : 'text-white'}`}>
              {currentFuel}
            </span>
            <span className="text-indigo-500">/ {meta.fuel}</span>
          </div>

          <div className="h-24 flex flex-col items-center justify-center gap-2">
            {!animating && visibleStatus === 'win' && (
              <div className="text-center text-2xl font-bold text-green-400">
                🪐 Планета достигнута!
              </div>
            )}
            {!animating && visibleStatus === 'fail' && (
              <div className="text-center text-2xl font-bold text-red-400">
                💥 Навигационный сбой. Повтори.
              </div>
            )}
            {!animating && lastCommandCount !== null && visibleStatus === 'win' && (
              <CommandCounter
                count={lastCommandCount}
                min={meta.minCommands}
                status={visibleStatus}
              />
            )}
            {!animating && visibleStatus === 'win' && lastCommandCount === null && levelStars[currentLevelIndex] && (
              <div className="text-xl">
                {'⭐'.repeat(levelStars[currentLevelIndex])}{'🌑'.repeat(3 - levelStars[currentLevelIndex])}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-80">
          <BippMessage hint={meta.hint} />
          <CommandInput
            onRun={handleRun}
            disabled={state.status === 'win'}
            code={currentCode}
            onCodeChange={handleCodeChange}
            activeCommandIndex={activeCommandIndex}
            failedCommandIndex={failedCommandIndex}
            lineExecCounts={lineExecCounts}
          />
          <button
            onClick={handleReset}
            className="py-2 rounded-lg text-indigo-400 hover:text-white transition-colors cursor-pointer"
          >
            🔄 Сбросить
          </button>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-indigo-700">
            <div className="flex gap-2">
              <button
                onClick={handlePreviousLevel}
                disabled={currentLevelIndex === 0}
                className="flex-1 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Назад
              </button>
              <button
                onClick={handleNextLevel}
                disabled={currentLevelIndex === levels.length - 1 || visibleStatus !== 'win' || animating}
                className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Далее →
              </button>
            </div>
            <button
              onClick={() => setScreen('select')}
              className="w-full py-2 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-indigo-300 hover:text-white text-sm transition-colors cursor-pointer border border-indigo-700"
            >
              ← На карту секторов
            </button>
          </div>
        </div>
      </div>
    </div>

    {showFinalScreen && (
      <FinalScreen onContinue={() => { setShowFinalScreen(false); setScreen('select') }} />
    )}
    </>
  )
}