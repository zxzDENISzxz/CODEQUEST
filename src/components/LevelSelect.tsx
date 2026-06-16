import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarBackground } from './StarBackground'
import { ShipSVG } from './GameGrid'
import { playClick } from '../core/sounds'
import type { LevelDef } from '../core/types'

interface Props {
  levels:      LevelDef[]
  levelWins:   Record<number, boolean>
  levelStars:  Record<number, number>
  levelGenius: Record<number, boolean>
  onSelect:    (index: number) => void
}


// ─── Журнал миссии ───────────────────────────────────────────

const COMMANDS = [
  ['move',         'шаг вперёд'],
  ['turn',         'поворот на 90° по часовой стрелке'],
  ['repeat N { }', 'повторить N раз команду в скобках'],
] as const

function MissionLogContent() {
  return (
    <>
      <p style={{ color: '#e0e7ff', fontSize: 14, lineHeight: 1.7, marginBottom: 14, fontFamily: "'Exo 2', sans-serif" }}>
        Пилот <span style={{ color: '#fbbf24', fontWeight: 700 }}>Зикс</span> застрял
        в дальнем космосе после аварии двигателя. Вместе с бортовым ИИ{' '}
        <span style={{ color: '#60a5fa', fontWeight: 700 }}>БИПП</span> он
        пробирается сквозь 8 опасных секторов к родной планете{' '}
        <span style={{ color: '#a78bfa', fontWeight: 700 }}>Аруме</span>.
      </p>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 16, fontFamily: "'Exo 2', sans-serif" }}>
        Пиши команды для навигационной системы. Каждый манёвр расходует топливо — не дай ему кончиться.
      </p>
      <div style={{ borderTop: '1px solid rgba(99,102,241,0.22)', marginBottom: 10 }} />
      <div style={{ color: '#6b7280', fontSize: 10, letterSpacing: '0.18em', fontFamily: "'Orbitron', sans-serif", marginBottom: 8 }}>
        КОМАНДЫ НАВИГАЦИИ
      </div>
      {COMMANDS.map(([cmd, desc]) => (
        <div key={cmd} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'baseline' }}>
          <span style={{ color: '#34d399', fontFamily: 'monospace', fontSize: 14, fontWeight: 600, minWidth: 120 }}>
            {cmd}
          </span>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>{desc}</span>
        </div>
      ))}
    </>
  )
}

function MissionLog() {
  const [isModal, setIsModal] = useState(() => !localStorage.getItem('missionLogSeen'))

  function closeModal() {
    playClick()
    localStorage.setItem('missionLogSeen', '1')
    setIsModal(false)
  }

  function openModal() {
    playClick()
    setIsModal(true)
  }

  return (
    <>
      {/* Модальное окно по центру */}
      <AnimatePresence>
        {isModal && (
          <motion.div
            key="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
              background: 'rgba(0,0,6,0.80)',
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{
                width: 'min(520px, calc(100vw - 48px))',
                background: 'rgba(6,9,24,0.97)',
                border: '1px solid rgba(99,102,241,0.38)',
                borderRadius: 18,
                padding: '28px 28px 22px',
                boxShadow: '0 0 60px rgba(99,102,241,0.2), 0 25px 50px rgba(0,0,0,0.65)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{
                textAlign: 'center', fontSize: 10, color: '#6366f1',
                letterSpacing: '0.28em', fontFamily: "'Orbitron', sans-serif", marginBottom: 18,
              }}>
                ◈ ЖУРНАЛ МИССИИ ◈
              </p>
              <MissionLogContent />
              <button
                onClick={closeModal}
                style={{
                  marginTop: 20, width: '100%', padding: '12px 0',
                  background: '#fbbf24', color: '#1e1b4b',
                  border: 'none', borderRadius: 12,
                  fontFamily: "'Orbitron', sans-serif", fontSize: 13,
                  fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer',
                }}
              >
                ✓ ПОНЯЛ, ПРИСТУПАЮ!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Трей — всегда виден когда модал закрыт */}
      {!isModal && (
        <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 20 }}>
          <button
            onClick={openModal}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px',
              background: 'rgba(6,9,24,0.90)',
              border: '1px solid rgba(99,102,241,0.38)',
              borderRadius: 10,
              color: '#a5b4fc', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.14em', cursor: 'pointer', fontFamily: "'Orbitron', sans-serif",
            }}
          >
            <motion.span
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            ЖУРНАЛ МИССИИ
            <span style={{ fontSize: 9 }}>▶</span>
          </button>
        </div>
      )}
    </>
  )
}

// ─── Линии между секторами ────────────────────────────────────

function SectorConnections({ levels, levelWins }: { levels: LevelDef[], levelWins: Record<number, boolean> }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {levels.slice(0, -1).map((level, i) => {
        const pos  = level.visual.mapPosition
        const next = levels[i + 1].visual.mapPosition
        const done = levelWins[i] ?? false
        return (
          <line
            key={i}
            x1={pos.x} y1={pos.y}
            x2={next.x} y2={next.y}
            stroke={done ? 'rgba(167,139,250,0.55)' : 'rgba(75,85,99,0.30)'}
            strokeWidth="0.4"
            strokeDasharray={done ? '1 0.7' : '0.5 1.2'}
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
    </svg>
  )
}

// ─── Нода сектора ─────────────────────────────────────────────

interface NodeProps {
  level:    LevelDef
  index:    number
  isWon:    boolean
  isLocked: boolean
  isLast:   boolean
  stars:    number
  isGenius: boolean
  onSelect: () => void
}

function SectorNode({ level, index, isWon, isLocked, isLast, stars, isGenius, onSelect }: NodeProps) {
  const [hovered, setHovered] = useState(false)
  const pos    = level.visual.mapPosition
  const theme  = level.visual.mapColor
  const showRight = pos.x < 52

  return (
    <div
      style={{
        position: 'absolute',
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: hovered ? 40 : 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Внешнее пульсирующее свечение */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -18,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 68%)`,
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.72, 0.4] }}
        transition={{
          duration: 2.8 + index * 0.28,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.45,
        }}
      />

      {/* Дополнительное кольцо при наведении */}
      {hovered && !isLocked && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: `1.5px solid ${theme.color}`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Кнопка-нода */}
      <motion.button
        onClick={() => { if (!isLocked) { playClick(); onSelect() } }}
        disabled={isLocked}
        animate={hovered && !isLocked ? { scale: 1.18 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        style={{
          position: 'relative',
          width: isLast ? 90 : 78,
          height: isLast ? 90 : 78,
          borderRadius: '50%',
          border: `${isLast ? 2.5 : 2}px solid ${
            isLocked
              ? '#374151'
              : hovered
                ? theme.color
                : `${theme.color}60`
          }`,
          background: isLocked
            ? 'rgba(17,24,39,0.88)'
            : hovered
              ? `radial-gradient(circle at 38% 38%, ${theme.color}50 0%, rgba(10,14,30,0.95) 68%)`
              : `radial-gradient(circle at 38% 38%, ${theme.color}20 0%, rgba(10,14,30,0.92) 68%)`,
          cursor: isLocked ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          opacity: isLocked ? 0.38 : 1,
          boxShadow: hovered && !isLocked
            ? `0 0 32px ${theme.glow}, 0 0 12px ${theme.color}60, inset 0 0 16px ${theme.color}18`
            : `0 0 14px ${theme.glow}70`,
          transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
        }}
      >
        {isLocked ? (
          <span style={{ fontSize: isLast ? 28 : 24 }}>🔒</span>
        ) : (
          <>
            <span style={{
              fontSize: 8,
              color: hovered ? theme.color : `${theme.color}90`,
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontFamily: "'Orbitron', sans-serif",
              lineHeight: 1,
            }}>
              СЕК
            </span>
            <span style={{
              fontSize: isLast ? 30 : 26,
              color: hovered ? 'white' : '#dde4ff',
              fontWeight: 900,
              lineHeight: 1.15,
            }}>
              {index + 1}
            </span>
          </>
        )}
      </motion.button>

      {/* Звёзды + гений под нодой (когда не наведено) */}
      {isWon && !hovered && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          <span style={{ fontSize: 16 }}>
            {'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}
          </span>
          {isGenius && (
            <motion.span
              style={{ fontSize: 12, color: '#fbbf24', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              🏆
            </motion.span>
          )}
        </div>
      )}

      {/* Тултип при наведении */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, x: showRight ? -8 : 8, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'absolute',
              top: '50%',
              ...(showRight
                ? { left: 'calc(100% + 16px)' }
                : { right: 'calc(100% + 16px)' }),
              transform: 'translateY(-50%)',
              width: 218,
              background: 'rgba(6,9,24,0.95)',
              border: `1px solid ${theme.color}38`,
              borderRadius: 14,
              padding: '14px 16px',
              boxShadow: `0 0 36px ${theme.glow}, 0 10px 36px rgba(0,0,0,0.7)`,
              pointerEvents: 'none',
              zIndex: 50,
            }}
          >
            {/* Засечка-стрелочка */}
            <div style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              ...(showRight ? { left: -7 } : { right: -7 }),
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              ...(showRight
                ? { borderRight: `7px solid ${theme.color}38` }
                : { borderLeft:  `7px solid ${theme.color}38` }),
            }} />

            <div style={{
              fontSize: 9,
              color: theme.color,
              fontWeight: 700,
              letterSpacing: '0.18em',
              fontFamily: "'Orbitron', sans-serif",
              marginBottom: 7,
            }}>
              СЕКТОР {index + 1}
            </div>

            <div style={{
              color: 'white',
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1.25,
              marginBottom: 7,
              fontFamily: "'Orbitron', sans-serif",
            }}>
              {level.meta.title}
            </div>

            <div style={{
              color: '#a5b4fc',
              fontSize: 12,
              lineHeight: 1.55,
              marginBottom: 10,
              fontFamily: "'Exo 2', sans-serif",
            }}>
              {level.meta.description}
            </div>

            {isLocked ? (
              <div style={{ color: '#6b7280', fontSize: 11 }}>
                🔒 Сектор заблокирован
              </div>
            ) : isWon ? (
              <>
                <div style={{ fontSize: 13, marginBottom: 4 }}>
                  {'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}
                  {isGenius && ' 🏆'}
                </div>
                <div style={{ color: isGenius ? '#fbbf24' : '#86efac', fontSize: 11, fontWeight: 600 }}>
                  {isGenius ? 'Гениальное решение!' : 'Маршрут пройден'}
                </div>
              </>
            ) : (
              <div style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>
                ▶ Войти в сектор
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Основной компонент ───────────────────────────────────────

export function LevelSelect({ levels, levelWins, levelStars, levelGenius, onSelect }: Props) {
  const completedCount = Object.values(levelWins).filter(Boolean).length

  return (
    <div className="relative h-screen text-white overflow-hidden flex flex-col" style={{ background: '#05060f' }}>
      <StarBackground />

      {/* Заголовок */}
      <div className="relative z-10 text-center pt-7">
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          CodeQuest <ShipSVG />
        </h1>
        <p className="text-indigo-500 mt-1 text-xs tracking-[0.28em] uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Навигационная карта
        </p>
        {completedCount > 0 && (
          <p className="text-indigo-400 mt-1 text-xs" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Пройдено секторов: {completedCount} / {levels.length}
          </p>
        )}
      </div>

      {/* Карта */}
      <div className="relative z-10 flex-1">
        <SectorConnections levels={levels} levelWins={levelWins} />
        <MissionLog />

        {levels.map((level, index) => (
          <SectorNode
            key={index}
            level={level}
            index={index}
            isWon={levelWins[index]   ?? false}
            isLocked={index > 0 && !(levelWins[index - 1] ?? false)}
            isLast={index === levels.length - 1}
            stars={levelStars[index]  ?? 0}
            isGenius={levelGenius[index] ?? false}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  )
}
