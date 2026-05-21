import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarBackground } from './StarBackground'

interface LevelMeta {
  id: number
  title: string
  description: string
}

interface Props {
  levels: { meta: LevelMeta }[]
  levelWins: Record<number, boolean>
  levelStars: Record<number, number>
  onSelect: (index: number) => void
}


// ─── Корабль в заголовке ─────────────────────────────────────

function TitleShip() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }}>
      <polygon points="36,20 8,10 8,30" fill="#93c5fd"/>
      <polygon points="12,10 6,4 8,10"  fill="#60a5fa"/>
      <polygon points="12,30 6,36 8,30" fill="#60a5fa"/>
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#1e40af"/>
      <circle  cx="21" cy="20" r="3.5"        fill="#0ea5e9"/>
      <circle  cx="21" cy="20" r="2"           fill="#bae6fd"/>
      <rect x="4" y="15" width="5" height="10" rx="2" fill="#475569"/>
      <ellipse cx="3" cy="20" rx="2.5" ry="4"   fill="#fbbf24" opacity="0.85"/>
      <ellipse cx="2" cy="20" rx="1.5" ry="2.5" fill="#fef08a" opacity="0.7"/>
    </svg>
  )
}

// ─── Журнал миссии ───────────────────────────────────────────

function MissionLog() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 20, width: 400 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '7px 12px',
          background: 'rgba(6,9,24,0.90)',
          border: '1px solid rgba(99,102,241,0.38)',
          borderRadius: open ? '10px 10px 0 0' : 10,
          color: '#a5b4fc', fontSize: 14, fontWeight: 700,
          letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'monospace',
        }}
      >
        <motion.span
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        ЖУРНАЛ МИССИИ
        <span style={{ marginLeft: 'auto', fontSize: 9 }}>{open ? '▼' : '▶'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: 'rgba(6,9,24,0.92)',
              border: '1px solid rgba(99,102,241,0.38)',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              padding: '20px 22px 18px',
            }}>
              {/* Лор */}
              <p style={{ color: '#e0e7ff', fontSize: 15, lineHeight: 1.7, marginBottom: 14 }}>
                Пилот <span style={{ color: '#fbbf24', fontWeight: 700 }}>Зикс</span> застрял
                в дальнем космосе после аварии двигателя. Вместе с бортовым ИИ{' '}
                <span style={{ color: '#60a5fa', fontWeight: 700 }}>БИПП</span> он
                пробирается сквозь 8 опасных секторов к родной планете{' '}
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>Аруме</span>.
              </p>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                Пиши команды для навигационной системы. Каждый манёвр расходует топливо — не дай ему кончиться.
              </p>

              {/* Разделитель */}
              <div style={{ borderTop: '1px solid rgba(99,102,241,0.22)', marginBottom: 10 }} />

              {/* Команды */}
              <div style={{
                color: '#6b7280', fontSize: 13, letterSpacing: '0.14em',
                fontFamily: 'monospace', marginBottom: 8,
              }}>
                КОМАНДЫ НАВИГАЦИИ
              </div>
              {([
                ['move',          'шаг вперёд'],
                ['turn',          'поворот на 90° по часовой стрелке'],
                ['repeat N { }',  'повторить N раз команду в скобках'],
              ] as const).map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'baseline' }}>
                  <span style={{
                    color: '#34d399', fontFamily: 'monospace',
                    fontSize: 14, fontWeight: 600, minWidth: 120,
                  }}>
                    {cmd}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: 14 }}>{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Позиции и цвета секторов ─────────────────────────────────

const SECTOR_POS = [
  { x: 13, y: 24 },  // 1 — Туманность Веги
  { x: 32, y: 14 },  // 2 — Пояс Дарна
  { x: 53, y: 22 },  // 3 — Облако Скрай
  { x: 72, y: 15 },  // 4 — Разлом Кеола
  { x: 82, y: 44 },  // 5 — Серая зона
  { x: 63, y: 60 },  // 6 — Кольца Зура
  { x: 36, y: 67 },  // 7 — Сектор Буря
  { x: 54, y: 82 },  // 8 — Родной сектор / Арума
]

const SECTOR_THEME = [
  { color: '#a78bfa', glow: 'rgba(167,139,250,0.55)' },  // 1 nebula
  { color: '#fb923c', glow: 'rgba(251,146,60,0.45)'  },  // 2 asteroid
  { color: '#c084fc', glow: 'rgba(192,132,252,0.50)' },  // 3 nebula
  { color: '#f97316', glow: 'rgba(249,115,22,0.40)'  },  // 4 asteroid
  { color: '#94a3b8', glow: 'rgba(148,163,184,0.40)' },  // 5 debris
  { color: '#22d3ee', glow: 'rgba(34,211,238,0.45)'  },  // 6 ice
  { color: '#9ca3af', glow: 'rgba(156,163,175,0.40)' },  // 7 debris
  { color: '#fbbf24', glow: 'rgba(251,191,36,0.55)'  },  // 8 home
]

// ─── Линии между секторами ────────────────────────────────────

function SectorConnections({ levelWins }: { levelWins: Record<number, boolean> }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {SECTOR_POS.slice(0, -1).map((pos, i) => {
        const next = SECTOR_POS[i + 1]
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
  level: { meta: LevelMeta }
  index: number
  isWon: boolean
  isLocked: boolean
  stars: number
  onSelect: () => void
}

function SectorNode({ level, index, isWon, isLocked, stars, onSelect }: NodeProps) {
  const [hovered, setHovered] = useState(false)
  const pos    = SECTOR_POS[index]
  const theme  = SECTOR_THEME[index]
  const isLast = index === 7
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
        onClick={() => !isLocked && onSelect()}
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
              fontSize: 10,
              color: hovered ? theme.color : `${theme.color}90`,
              fontWeight: 700,
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
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

      {/* Звёзды под нодой (когда не наведено) */}
      {isWon && !hovered && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}>
          {'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}
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
              letterSpacing: '0.14em',
              fontFamily: 'monospace',
              marginBottom: 7,
            }}>
              СЕКТОР {index + 1}
            </div>

            <div style={{
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.25,
              marginBottom: 7,
            }}>
              {level.meta.title}
            </div>

            <div style={{
              color: '#a5b4fc',
              fontSize: 12,
              lineHeight: 1.55,
              marginBottom: 10,
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
                </div>
                <div style={{ color: '#86efac', fontSize: 11, fontWeight: 600 }}>
                  Маршрут пройден
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

export function LevelSelect({ levels, levelWins, levelStars, onSelect }: Props) {
  const completedCount = Object.values(levelWins).filter(Boolean).length

  return (
    <div className="relative h-screen text-white overflow-hidden flex flex-col" style={{ background: '#05060f' }}>
      <StarBackground />

      {/* Заголовок */}
      <div className="relative z-10 text-center pt-7">
        <h1 className="text-4xl font-bold text-yellow-400">CodeQuest<TitleShip /></h1>
        <p className="text-indigo-500 mt-1 text-xs tracking-[0.28em] uppercase">
          Навигационная карта
        </p>
        {completedCount > 0 && (
          <p className="text-indigo-400 mt-1 text-xs">
            Пройдено секторов: {completedCount} / {levels.length}
          </p>
        )}
      </div>

      {/* Карта */}
      <div className="relative z-10 flex-1">
        <SectorConnections levelWins={levelWins} />
        <MissionLog />

        {levels.map((level, index) => (
          <SectorNode
            key={index}
            level={level}
            index={index}
            isWon={levelWins[index]   ?? false}
            isLocked={index > 0 && !(levelWins[index - 1] ?? false)}
            stars={levelStars[index]  ?? 0}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  )
}
