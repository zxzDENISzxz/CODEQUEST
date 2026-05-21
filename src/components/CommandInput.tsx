import { useRef, useEffect } from 'react'

interface Props {
  onRun: (code: string) => void
  disabled: boolean
  code: string
  onCodeChange: (code: string) => void
  activeCommandIndex: number | null
  failedCommandIndex?: number | null
}

export function CommandInput({ onRun, disabled, code, onCodeChange, activeCommandIndex, failedCommandIndex }: Props) {
  const lines = code.split('\n')
  const activeLineRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Авто-скролл к активной строке
  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      const container = scrollRef.current
      const line = activeLineRef.current
      const lineTop = line.offsetTop
      const lineBottom = lineTop + line.offsetHeight
      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.offsetHeight

      if (lineBottom > containerBottom || lineTop < containerTop) {
        container.scrollTo({
          top: lineTop - container.offsetHeight / 2,
          behavior: 'smooth',
        })
      }
    }
  }, [activeCommandIndex])

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-indigo-700 focus-within:border-yellow-400">

        {/* Подсветка строк — скроллится вместе с textarea */}
        <div
          ref={scrollRef}
          className="absolute inset-0 pointer-events-none font-mono text-sm p-3 overflow-hidden"
          style={{ lineHeight: '1.5rem' }}
        >
          {lines.map((line, i) => {
            const isActive = i === activeCommandIndex
            const isFailed = i === failedCommandIndex

            return (
              <div
                key={i}
                ref={isActive || isFailed ? activeLineRef : null}
                className={`leading-6 transition-colors duration-150 rounded ${
                  isFailed
                    ? 'bg-red-500/30 text-red-300'
                    : isActive
                      ? 'bg-yellow-400/20 text-yellow-300'
                      : 'text-transparent'
                }`}
              >
                {line || ' '}
              </div>
            )
          })}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={e => {
            onCodeChange(e.target.value)
            // Синхронизируем скролл подсветки с textarea
            if (scrollRef.current) {
              const target = e.target as HTMLTextAreaElement
              scrollRef.current.scrollTop = target.scrollTop
            }
          }}
          onScroll={e => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop
            }
          }}
          disabled={disabled}
          placeholder={'direction right\nrepeat 4 {\n  move\n}'}
          className="
            absolute inset-0 w-full h-full p-3 font-mono text-sm
            bg-transparent text-white leading-6
            placeholder-indigo-500 resize-none outline-none
            disabled:opacity-50
          "
          style={{ caretColor: 'white' }}
        />
      </div>

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
        onClick={() => onCodeChange('')}
        className="py-2 rounded-lg text-indigo-400 hover:text-white transition-colors cursor-pointer"
      >
        Очистить
      </button>
    </div>
  )
}