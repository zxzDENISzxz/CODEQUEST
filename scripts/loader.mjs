// Custom Node.js loader for the solver script.
// - Resolves extensionless .ts/.tsx imports (Vite handles this, Node doesn't)
// - Stubs .tsx files: reads their exports and returns null-valued stubs
//   so named imports like `import { PlanetPixo } from '...'` don't throw.

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve as pathResolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/** Extract all named export identifiers from TypeScript/JSX source via regex. */
function extractExports(src) {
  const names = new Set()
  // export const/let/var/function/class Name
  for (const m of src.matchAll(/export\s+(?:const|let|var|function\s*\*?|class)\s+(\w+)/g))
    names.add(m[1])
  // export { Name, Name as Alias }
  for (const m of src.matchAll(/export\s*\{([^}]+)\}/g))
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^\w+$/.test(name)) names.add(name)
    }
  return [...names]
}

export async function resolve(specifier, context, nextResolve) {
  // Only handle relative imports without extension, from a real file URL
  if (
    specifier.startsWith('.') &&
    context.parentURL?.startsWith('file:') &&
    !/\.[jt]sx?$/.test(specifier)
  ) {
    const parentDir = dirname(fileURLToPath(context.parentURL))
    for (const ext of ['.ts', '.tsx']) {
      const candidate = pathResolve(parentDir, specifier + ext)
      if (existsSync(candidate))
        return { shortCircuit: true, url: pathToFileURL(candidate).href }
    }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  // Stub .tsx files — read their exports, generate null-valued replacements
  if (url.startsWith('file:') && url.endsWith('.tsx')) {
    let src = ''
    try { src = readFileSync(fileURLToPath(url), 'utf8') } catch { /* ignore */ }
    const names = extractExports(src)
    const stub = [
      'export default null;',
      ...names.map(n => `export const ${n} = null;`),
    ].join('\n')
    return { format: 'module', shortCircuit: true, source: stub }
  }
  return nextLoad(url, context)
}
