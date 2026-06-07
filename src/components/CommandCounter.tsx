import { motion } from 'framer-motion'

export function calcStars(count: number, min: number): number {
  return count <= min ? 3 : count <= min * 1.5 ? 2 : 1
}

interface Props {
  count:        number
  min:          number
  status:       'idle' | 'win' | 'fail'
  beatOptimal?: boolean
}

export function CommandCounter({ count, min, status, beatOptimal = false }: Props) {
  if (status === 'idle') return null

  const stars = calcStars(count, min)

  return (
    <div className={`
      rounded-lg p-3 text-center border
      ${status === 'win'
        ? beatOptimal
          ? 'bg-yellow-900/40 border-yellow-600'
          : 'bg-green-900/40 border-green-700'
        : 'bg-red-900/40 border-red-800'
      }
    `}>
      {beatOptimal ? (
        <motion.div
          className="text-lg"
          animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}
        </motion.div>
      ) : (
        <div className="text-lg">
          {'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}
        </div>
      )}
      <div className="text-sm mt-1">
        <span className="text-white font-bold">{count}</span>
        <span className="text-indigo-400"> / минимум </span>
        <span className={`font-bold ${beatOptimal ? 'text-yellow-400' : 'text-yellow-400'}`}>{min}</span>
        <span className="text-indigo-400"> команд</span>
      </div>
    </div>
  )
}
