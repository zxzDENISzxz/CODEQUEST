import { parseCommands } from './CommandParser'

// Простой тест прямо в консоли
const result = parseCommands(`
turn
repeat 3 {
  move
}
`)

console.log(JSON.stringify(result, null, 2))