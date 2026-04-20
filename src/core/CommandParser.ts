// Типы команд которые понимает игра
export type Direction = 'up' | 'down' | 'left' | 'right'

export type Command =
  | { type: 'move'; direction: Direction }
  | { type: 'repeat'; times: number; commands: Command[] }
  | { type: 'if'; condition: string; commands: Command[] }

export type ParseResult =
  | { ok: true; commands: Command[] }
  | { ok: false; error: string; line: number }

// Парсит текст который вводит игрок и возвращает список команд
export function parseCommands(input: string): ParseResult {
  const lines = input
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  try {
    const commands = parseLines(lines, 0).commands
    return { ok: true, commands }
  } catch (e: unknown) {
    const err = e as { message: string; line: number }
    return { ok: false, error: err.message, line: err.line ?? 0 }
  }
}

function parseLines(lines: string[], startIndex: number): { commands: Command[]; nextIndex: number } {
  const commands: Command[] = []
  let i = startIndex

  while (i < lines.length) {
    const line = lines[i]

    // Выход из блока
    if (line === '}') {
      return { commands, nextIndex: i + 1 }
    }

    // move up / move down / move left / move right
    const moveMatch = line.match(/^move\s+(up|down|left|right)$/)
    if (moveMatch) {
      commands.push({ type: 'move', direction: moveMatch[1] as Direction })
      i++
      continue
    }

    // repeat N {
    const repeatMatch = line.match(/^repeat\s+(\d+)\s*\{$/)
    if (repeatMatch) {
      const result = parseLines(lines, i + 1)
      commands.push({
        type: 'repeat',
        times: parseInt(repeatMatch[1]),
        commands: result.commands,
      })
      i = result.nextIndex
      continue
    }

    throw { message: `Неизвестная команда: "${line}"`, line: i + 1 }
  }

  return { commands, nextIndex: i }
}