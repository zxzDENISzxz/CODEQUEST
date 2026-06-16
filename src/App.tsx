import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StarBackground } from './components/StarBackground'
import { GameGrid, ShipSVG } from './components/GameGrid'
import { CommandInput } from './components/CommandInput'
import { BippMessage } from './components/BippMessage'
import { FinalScreen } from './components/FinalScreen'
import { BippBriefing } from './components/BippBriefing'
import { LevelSelect } from './components/LevelSelect'
import { CommandCounter, calcStars } from './components/CommandCounter'
import { parseCommands } from './core/CommandParser'
import { runCommands, countCommands } from './core/GameEngine'
import { startThruster, stopThruster, playTurn, playWin, playFail, playClick, setMuted, initBackgroundMusic, playBackgroundMusic, stopBackgroundMusic } from './core/sounds'
import { levels, getLevelSolution } from './levels/index'
import { useGameStore } from './store/gameStore'
import type { GameState, Position, GameEvent } from './core/GameEngine'

const DIR_ANGLE: Record<string, number> = { right: 0, down: 90, left: 180, up: -90 }

function BeatOptimalBanner() {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 22 }}
      className="flex flex-col items-center gap-1"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl font-bold whitespace-nowrap"
        style={{ fontFamily: "'Orbitron', sans-serif", color: '#fbbf24' }}
      >
        🏆 Гениально!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-yellow-300 font-semibold whitespace-nowrap"
        style={{ fontFamily: "'Exo 2', sans-serif" }}
      >
        Ты превзошёл оптимальное решение БИПП!
      </motion.div>
    </motion.div>
  )
}
function nearestAngle(current: number, target: number): number {
  return current + (((target - current) % 360 + 540) % 360 - 180)
}

export default function App() {
  const [screen, setScreen] = useState<'select' | 'game'>('select')
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const { levelWins, levelCodes, levelStars, levelGenius, briefingsSeen, setWin, setStars, setGenius, setBriefingSeen } = useGameStore()

  const [currentFuel, setCurrentFuel] = useState<number>(getLevelSolution(levels[0].meta.id).minMoves)

  const [state, setState] = useState<GameState>({
    ...levels[0].state,
    status: 'idle',
  })
  const [displayPos, setDisplayPos] = useState<Position>(levels[0].state.player)
  const [currentRotation, setCurrentRotation] = useState(0)
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
  const [showBriefing, setShowBriefing] = useState(false)
  const [briefingInstant, setBriefingInstant] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [beatOptimal, setBeatOptimal] = useState(false)
  const freshWinRef = useRef(false)

  useEffect(() => {
    if (visibleStatus === 'win' && currentLevelIndex === levels.length - 1 && !animating && freshWinRef.current) {
      freshWinRef.current = false
      const t = setTimeout(() => setShowFinalScreen(true), 1400)
      return () => clearTimeout(t)
    }
  }, [visibleStatus, currentLevelIndex, animating])

  // Инициализация фоновой музыки при монтировании, управление при изменении экрана
  useEffect(() => {
    initBackgroundMusic()
  }, [])

  useEffect(() => {
    // Если вышли из игры в меню — останавливаем
    if (screen !== 'game') {
      stopBackgroundMusic()
    }
  }, [screen])

  function getLevelState(index: number): GameState {
    return {
      ...levels[index].state,
      status: levelWins[index] ? 'win' : 'idle',
      fuel: getLevelSolution(levels[index].meta.id).minMoves,
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
    startThruster()

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
        playTurn()
        setCurrentRotation(r => r + 90)
        setActiveCommandIndex(event.commandIndex)
        setLineExecCounts(prev => ({ ...prev, [event.commandIndex]: (prev[event.commandIndex] ?? 0) + 1 }))
      }

      if (event.type === 'fail' && event.commandIndex >= 0) {
        setFailedCommandIndex(event.commandIndex)
      }

      if (event.type === 'win' || event.type === 'fail') {
        stopThruster()
        event.type === 'win' ? playWin() : playFail()
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
        stopThruster()
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
  const currentSolution = getLevelSolution(meta.id)
  const currentCode = levelCodes[currentLevelIndex] ?? ''
  const gridWidth = state.grid[0].length * 64 + (state.grid[0].length - 1) * 4

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
      setCurrentRotation(r => nearestAngle(r, DIR_ANGLE[levels[currentLevelIndex].state.direction ?? 'right']))
      setVisibleStatus('idle')
      setActiveCommandIndex(null)
      setFailedCommandIndex(null)
      setLineExecCounts({})
      setCurrentFuel(currentSolution.minMoves)

      setTimeout(() => {
        setTeleporting(false)

        const freshState: GameState = {
          ...levels[currentLevelIndex].state,
          status: 'idle',
          fuel: currentSolution.minMoves,
        }

        const { events, finalState } = runCommands(freshState, parsed.commands)
        const count = countCommands(parsed.commands)
        setLastCommandCount(count)
        setState(finalState)

        if (finalState.status === 'win') {
          setWin(currentLevelIndex)
          setStars(currentLevelIndex, calcStars(count, currentSolution.minCommands))
          const isGenius = count < currentSolution.minCommands
          setBeatOptimal(isGenius)
          if (isGenius) setGenius(currentLevelIndex)
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
    stopThruster()
    animationRef.current = false
    setAnimating(false)
    setTeleporting(false)
    setVisibleStatus('idle')
    setActiveCommandIndex(null)
    setCurrentRotation(r => nearestAngle(r, DIR_ANGLE[levels[currentLevelIndex].state.direction ?? 'right']))
    setDisplayPos(levels[currentLevelIndex].state.player)
    setState({ ...levels[currentLevelIndex].state, status: 'idle', fuel: currentSolution.minMoves })
    setCurrentFuel(currentSolution.minMoves)
    setLastCommandCount(null)
    setFailedCommandIndex(null)
    setLineExecCounts({})
    setShowFinalScreen(false)
    setBeatOptimal(levelGenius[currentLevelIndex] ?? false)
    freshWinRef.current = false
  }

  function handleNextLevel() {
    const nextIndex = currentLevelIndex + 1
    if (nextIndex < levels.length) {
      setVisibleStatus(levelWins[nextIndex] ? 'win' : 'idle')
      setCurrentLevelIndex(nextIndex)
      setState(getLevelState(nextIndex))
      setDisplayPos(levels[nextIndex].state.player)
      setCurrentRotation(r => nearestAngle(r, DIR_ANGLE[levels[nextIndex].state.direction ?? 'right']))
      setCurrentFuel(getLevelSolution(levels[nextIndex].meta.id).minMoves)
      setActiveCommandIndex(null)
      setLastCommandCount(null)
      setLineExecCounts({})
      setFailedCommandIndex(null)
      setBeatOptimal(levelGenius[nextIndex] ?? false)
      if (levels[nextIndex].meta.briefing && !briefingsSeen[nextIndex]) { setBriefingInstant(false); setShowBriefing(true) }
    }
  }

  function handlePreviousLevel() {
    const prevIndex = currentLevelIndex - 1
    if (prevIndex >= 0) {
      setVisibleStatus(levelWins[prevIndex] ? 'win' : 'idle')
      setCurrentLevelIndex(prevIndex)
      setState(getLevelState(prevIndex))
      setDisplayPos(levels[prevIndex].state.player)
      setCurrentRotation(r => nearestAngle(r, DIR_ANGLE[levels[prevIndex].state.direction ?? 'right']))
      setCurrentFuel(getLevelSolution(levels[prevIndex].meta.id).minMoves)
      setActiveCommandIndex(null)
      setLastCommandCount(null)
      setLineExecCounts({})
      setFailedCommandIndex(null)
      setBeatOptimal(levelGenius[prevIndex] ?? false)
      if (levels[prevIndex].meta.briefing && !briefingsSeen[prevIndex]) { setBriefingInstant(false); setShowBriefing(true) }
    }
  }

    if (screen === 'select') {
      return (
        <LevelSelect
          levels={levels}
          levelWins={levelWins}
          levelStars={levelStars}
          levelGenius={levelGenius}
          onSelect={(index) => {
            // Включаем музыку здесь — в момент клика пользователя!
            playBackgroundMusic() 

            setCurrentLevelIndex(index)
            setState(getLevelState(index))
            setDisplayPos(levels[index].state.player)
            setCurrentRotation(r => nearestAngle(r, DIR_ANGLE[levels[index].state.direction ?? 'right']))
            setVisibleStatus(levelWins[index] ? 'win' : 'idle')
            setCurrentFuel(getLevelSolution(levels[index].meta.id).minMoves)
            setActiveCommandIndex(null)
            setLastCommandCount(null)
            setLineExecCounts({})
            setFailedCommandIndex(null)
            setBeatOptimal(levelGenius[index] ?? false)
            setScreen('game')
            if (levels[index].meta.briefing && !briefingsSeen[index]) { setBriefingInstant(false); setShowBriefing(true) }
          }}
        />
      )
    }

  return (
    <>
    <div className="relative min-h-screen text-white flex flex-col items-center gap-8 p-8 pt-12" style={{ background: '#05060f' }}>
      <StarBackground />

      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          CodeQuest <ShipSVG animating={animating} />
        </h1>
        <p className="text-indigo-300 mt-1" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.85rem', letterSpacing: '0.04em' }}>Сектор {meta.id} — {meta.title}</p>
        <p className="text-indigo-400 text-sm mt-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>{meta.description}</p>
      </div>

      <div className="grid gap-12 items-start w-full max-w-4xl" style={{ gridTemplateColumns: '1fr auto' }}>
        <div className="flex flex-col gap-4 items-center">
          <GameGrid
            key={currentLevelIndex}
            grid={state.grid}
            player={displayPos}
            goal={state.goal}
            teleporting={teleporting}
            rotation={currentRotation}
            obstacleTheme={currentLevel.visual.obstacleTheme}
            GoalPlanet={currentLevel.visual.GoalPlanet}
            animating={animating}
          />
          <div className="flex items-center gap-2 text-sm font-mono">
            <span>⛽</span>
            <span className="text-indigo-300">Топливо:</span>
            <span className={`font-bold ${currentFuel <= 2 ? 'text-red-400' : 'text-white'}`}>
              {currentFuel}
            </span>
            <span className="text-indigo-500">/ {currentSolution.minMoves}</span>
          </div>

          <div className="min-h-[96px] flex flex-col items-center justify-center gap-2" style={{ width: gridWidth }}>
            {!animating && visibleStatus === 'win' && !beatOptimal && (
              <div className="whitespace-nowrap text-center text-2xl font-bold text-green-400">
                🪐 Планета достигнута!
              </div>
            )}
            {!animating && visibleStatus === 'win' && beatOptimal && (
              <BeatOptimalBanner />
            )}
            {!animating && visibleStatus === 'fail' && (
              <div className="whitespace-nowrap text-center text-2xl font-bold text-red-400">
                💥 Навигационный сбой. Попробуй снова.
              </div>
            )}
            {!animating && lastCommandCount !== null && visibleStatus === 'win' && (
              <CommandCounter
                count={lastCommandCount}
                min={currentSolution.minCommands}
                status={visibleStatus}
                beatOptimal={beatOptimal}
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
          <div className="flex justify-end">
            <button
              onClick={() => { playClick(); const next = !isMuted; setMuted(next); setIsMuted(next) }}
              className="text-2xl opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
          <BippMessage
            hint={meta.hint}
            onOpenBriefing={meta.briefing ? () => { setBriefingInstant(true); setShowBriefing(true) } : undefined}
          />
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
            onClick={() => { playClick(); handleReset() }}
            className="py-2 rounded-lg text-indigo-400 hover:text-white transition-colors cursor-pointer"
          >
            🔄 Сбросить
          </button>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-indigo-700">
            <div className="flex gap-2">
              <button
                onClick={() => { playClick(); handlePreviousLevel() }}
                disabled={currentLevelIndex === 0}
                className="flex-1 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Назад
              </button>
              <button
                onClick={() => { playClick(); handleNextLevel() }}
                disabled={currentLevelIndex === levels.length - 1 || visibleStatus !== 'win' || animating}
                className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Далее →
              </button>
            </div>
            <button
              onClick={() => { playClick(); setScreen('select') }}
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
    {showBriefing && meta.briefing && (
      <BippBriefing
        levelId={meta.id}
        title={meta.title}
        text={meta.briefing}
        instant={briefingInstant}
        HintPanel={currentLevel.HintPanel}
        onClose={() => { setBriefingSeen(currentLevelIndex); setShowBriefing(false) }}
      />
    )}
    </>
  )
}