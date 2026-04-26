interface Props {
  count: number
  min: number
  status: 'idle' | 'win' | 'fail'
}

export function CommandCounter({ count, min, status }: Props) {
  if (status === 'idle') return null

  const isOptimal = count <= min
  const stars = count <= min ? 3 : count <= min * 1.5 ? 2 : 1

  return (
    <div className={`
      rounded-lg p-3 text-center border
      ${status === 'win'
        ? 'bg-green-900/40 border-green-700'
        : 'bg-red-900/40 border-red-800'
      }
    `}>
      <div className="text-lg">
        {'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}
      </div>
      <div className="text-sm mt-1">
        <span className="text-white font-bold">{count}</span>
        <span className="text-indigo-400"> / минимум </span>
        <span className="text-yellow-400 font-bold">{min}</span>
        <span className="text-indigo-400"> команд</span>
      </div>
      {isOptimal && status === 'win' && (
        <div className="text-green-400 text-xs mt-1">Оптимальное решение! 🏆</div>
      )}
    </div>
  )
}