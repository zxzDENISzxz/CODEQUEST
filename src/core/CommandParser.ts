export type Direction = 'up' | 'down' | 'left' | 'right'

export type Command =
  | { type: 'move' }
  | { type: 'repeat'; times: number; commands: Command[] }
  | { type: 'direction'; direction: Direction }
  | { type: 'if'; condition: string; commands: Command[] }

export type ParseResult =
  | { ok: true; commands: Command[] }
  | { ok: false; error: string; line: number }

export function parseCommands(input: string): ParseResult {
  // Нормализуем input: { и } всегда на отдельных строках
  const normalized = input
    .replace(/\{/g, '\n{\n')
    .replace(/\}/g, '\n}\n')

  const lines = normalized
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  try {
    const { commands } = parseLines(lines, 0)
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

    if (line === '}') {
      return { commands, nextIndex: i + 1 }
    }

    if (line === 'move') {
      commands.push({ type: 'move' })
      i++
      continue
    }

    // move up/down/left/right
    const moveDirectionMatch = line.match(/^move\s+(up|down|left|right)$/)
    if (moveDirectionMatch) {
      commands.push({ type: 'direction', direction: moveDirectionMatch[1] as Direction })
      commands.push({ type: 'move' })
      i++
      continue
    }

    // direction up/down/left/right
    const directionMatch = line.match(/^direction\s+(up|down|left|right)$/)
    if (directionMatch) {
      commands.push({ type: 'direction', direction: directionMatch[1] as Direction })
      i++
      continue
    }

    // repeat N или repeat N {
    const repeatMatch = line.match(/^repeat\s+(\d+)\s*\{?$/)
    if (repeatMatch) {
      // Если { уже в этой строке — следующий токен это содержимое блока
      // Если нет — следующая строка должна быть {
      let bodyStart = i + 1
      if (!line.includes('{')) {
        // ожидаем { на следующей строке
        if (lines[bodyStart] !== '{') {
          throw { message: `Ожидается { после repeat`, line: i + 1 }
        }
        bodyStart++
      }
      const result = parseLines(lines, bodyStart)
      commands.push({
        type: 'repeat',
        times: parseInt(repeatMatch[1]),
        commands: result.commands,
      })
      i = result.nextIndex
      continue
    }

    // Открывающая скобка отдельной строкой — пропускаем
    if (line === '{') {
      i++
      continue
    }

    throw { message: `Неизвестная команда: "${line}"`, line: i + 1 }
  }

  return { commands, nextIndex: i }
}