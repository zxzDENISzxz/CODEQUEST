export type Direction = 'up' | 'down' | 'left' | 'right'

export type Command =
  | { type: 'move'; lineIndex: number }
  | { type: 'turn'; lineIndex: number }
  | { type: 'repeat'; times: number; commands: Command[]; lineIndex: number }
  | { type: 'if'; condition: string; commands: Command[]; lineIndex: number }

export type ParseResult =
  | { ok: true; commands: Command[] }
  | { ok: false; error: string; line: number }

export function parseCommands(input: string): ParseResult {
  const { normalizedLines, lineMap } = buildNormalizedLines(input)

  try {
    const { commands } = parseLines(normalizedLines, lineMap, 0)
    return { ok: true, commands }
  } catch (e: unknown) {
    const err = e as { message: string; line: number }
    return { ok: false, error: err.message, line: err.line ?? 0 }
  }
}

// Разбивает строки по { и }, сохраняя маппинг на оригинальные номера строк
function buildNormalizedLines(input: string): { normalizedLines: string[]; lineMap: number[] } {
  const normalizedLines: string[] = []
  const lineMap: number[] = []

  input.split('\n').forEach((rawLine, origIdx) => {
    const parts = rawLine.split(/([{}])/).map(p => p.trim()).filter(p => p.length > 0)
    for (const part of parts) {
      normalizedLines.push(part)
      lineMap.push(origIdx)
    }
  })

  return { normalizedLines, lineMap }
}

function parseLines(
  lines: string[],
  lineMap: number[],
  startIndex: number
): { commands: Command[]; nextIndex: number } {
  const commands: Command[] = []
  let i = startIndex

  while (i < lines.length) {
    const line = lines[i]
    const origLine = lineMap[i]

    if (line === '}') {
      return { commands, nextIndex: i + 1 }
    }

    if (line === 'move') {
      commands.push({ type: 'move', lineIndex: origLine })
      i++
      continue
    }

    if (line === 'turn') {
      commands.push({ type: 'turn', lineIndex: origLine })
      i++
      continue
    }

    const repeatMatch = line.match(/^repeat\s+(\d+)$/)
    if (repeatMatch) {
      let bodyStart = i + 1
      if (lines[bodyStart] !== '{') {
        throw { message: `Ожидается { после repeat`, line: origLine + 1 }
      }
      bodyStart++
      const result = parseLines(lines, lineMap, bodyStart)
      commands.push({
        type: 'repeat',
        times: parseInt(repeatMatch[1]),
        commands: result.commands,
        lineIndex: origLine,
      })
      i = result.nextIndex
      continue
    }

    if (line === '{') {
      i++
      continue
    }

    throw { message: `Неизвестная команда: "${line}"`, line: origLine + 1 }
  }

  return { commands, nextIndex: i }
}
