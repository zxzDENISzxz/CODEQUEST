import { motion } from 'framer-motion'

interface LevelMeta {
  id: number
  title: string
  description: string
}

interface Props {
  levels: { meta: LevelMeta }[]
  levelWins: Record<number, boolean>
  onSelect: (index: number) => void
}

export function LevelSelect({ levels, levelWins, onSelect }: Props) {
  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400">CodeQuest 🚀</h1>
        <p className="text-indigo-300 mt-2">Выбери уровень</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {levels.map((level, index) => {
          const isWon = levelWins[index] ?? false
          const isLocked = index > 0 && !(levelWins[index - 1] ?? false)

          return (
            <motion.button
              key={index}
              onClick={() => !isLocked && onSelect(index)}
              disabled={isLocked}
              whileHover={isLocked ? {} : { scale: 1.03 }}
              whileTap={isLocked ? {} : { scale: 0.97 }}
              className={`
                relative p-5 rounded-xl text-left border transition-colors
                ${isLocked
                  ? 'bg-indigo-900/40 border-indigo-800 opacity-50 cursor-not-allowed'
                  : isWon
                    ? 'bg-indigo-800 border-yellow-400 cursor-pointer'
                    : 'bg-indigo-900 border-indigo-700 hover:border-indigo-500 cursor-pointer'
                }
              `}
            >
              {/* Статус иконка */}
              <div className="text-2xl mb-2">
                {isLocked ? '🔒' : isWon ? '⭐' : '▶️'}
              </div>

              <div className="font-bold text-white">
                Уровень {level.meta.id}
              </div>
              <div className="text-indigo-300 text-sm mt-1">
                {level.meta.title}
              </div>
              <div className="text-indigo-400 text-xs mt-1">
                {level.meta.description}
              </div>

              {/* Бейдж пройден */}
              {isWon && (
                <div className="absolute top-3 right-3 text-xs bg-yellow-400 text-indigo-950 font-bold px-2 py-0.5 rounded-full">
                  Пройден
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}