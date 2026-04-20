import { parseCommands } from './CommandParser'

// Простой тест прямо в консоли
const result = parseCommands(`
move right
move right
repeat 3 {
  move up
}
`)

console.log(JSON.stringify(result, null, 2))