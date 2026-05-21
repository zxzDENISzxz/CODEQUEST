import { useRef, useEffect, useState } from 'react'

interface Props {
  onRun: (code: string) => void
  disabled: boolean
  code: string
  onCodeChange: (code: string) => void
  activeCommandIndex: number | null
  failedCommandIndex?: number | null
  lineExecCounts?: Record<number, number>
}

const LINE_HEIGHT = 24  // leading-6 = 1.5rem = 24px
const PADDING_TOP = 12  // p-3 = 12px

export function CommandInput({ onRun, disabled, code, onCodeChange, activeCommandIndex, failedCommandIndex, lineExecCounts = {} }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    if (activeCommandIndex === null || !textareaRef.current) return

    const textarea = textareaRef.current
    const lineTop = PADDING_TOP + activeCommandIndex * LINE_HEIGHT
    const lineBottom = lineTop + LINE_HEIGHT
    const visibleTop = textarea.scrollTop
    const visibleBottom = visibleTop + textarea.clientHeight

    if (lineBottom > visibleBottom || lineTop < visibleTop) {
      const next = Math.max(0, lineTop - textarea.clientHeight / 2 + LINE_HEIGHT / 2)
      textarea.scrollTop = next
      setScrollTop(next)
    }
  }, [activeCommandIndex])

  function highlightTop(lineIdx: number | null | undefined): number | null {
    if (lineIdx == null) return null
    return PADDING_TOP + lineIdx * LINE_HEIGHT - scrollTop
  }

  const activeTop = highlightTop(activeCommandIndex)
  const failedTop = highlightTop(failedCommandIndex)
  const containerH = textareaRef.current?.clientHeight ?? 192

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-indigo-700 focus-within:border-yellow-400 bg-indigo-950">

        {failedTop !== null && failedTop + LINE_HEIGHT > 0 && failedTop < containerH && (
          <div
            className="absolute inset-x-0 bg-red-500/30 pointer-events-none"
            style={{ top: failedTop, height: LINE_HEIGHT }}
          />
        )}

        {activeTop !== null && activeTop + LINE_HEIGHT > 0 && activeTop < containerH && (
          <div
            className="absolute inset-x-0 bg-yellow-400/20 pointer-events-none"
            style={{ top: activeTop, height: LINE_HEIGHT }}
          />
        )}

        {Object.entries(lineExecCounts).map(([idxStr, count]) => {
          if (!count) return null
          const top = PADDING_TOP + Number(idxStr) * LINE_HEIGHT - scrollTop
          if (top + LINE_HEIGHT <= 0 || top >= containerH) return null
          return (
            <div
              key={idxStr}
              className="absolute right-5 flex items-center pointer-events-none z-20"
              style={{ top, height: LINE_HEIGHT }}
            >
              <span className="text-xs font-mono text-indigo-400 bg-indigo-900 px-1 rounded border border-indigo-700">
                ×{count}
              </span>
            </div>
          )
        })}

        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          onScroll={e => setScrollTop((e.target as HTMLTextAreaElement).scrollTop)}
          disabled={disabled}
          placeholder="введи команды..."
          className="
            absolute inset-0 w-full h-full p-3 font-mono text-sm
            bg-transparent text-white leading-6
            placeholder-indigo-500 resize-none outline-none pr-14
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
