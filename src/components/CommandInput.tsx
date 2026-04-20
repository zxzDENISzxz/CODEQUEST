import { useState } from 'react'

interface Props {
  onRun: (code: string) => void
  disabled: boolean
}

export function CommandInput({ onRun, disabled }: Props) {
  const [code, setCode] = useState('')

  return (
    <div className="flex flex-col gap-3 w-80">
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        disabled={disabled}
        placeholder={'move right\nmove up\nrepeat 3 {\n  move right\n}'}
        className="
          w-full h-48 p-3 rounded-lg font-mono text-sm
          bg-indigo-950 border border-indigo-700 text-white
          placeholder-indigo-500 resize-none outline-none
          focus:border-yellow-400 disabled:opacity-50
        "
      />
      <button
        onClick={() => onRun(code)}
        disabled={disabled}
        className="
          py-3 rounded-lg font-bold text-lg
          bg-yellow-400 text-indigo-950
          hover:bg-yellow-300 disabled:opacity-50
          transition-colors cursor-pointer
        "
      >
        ▶ Запустить
      </button>
      <button
        onClick={() => setCode('')}
        className="py-2 rounded-lg text-indigo-400 hover:text-white transition-colors cursor-pointer"
      >
        Очистить
      </button>
    </div>
  )
}