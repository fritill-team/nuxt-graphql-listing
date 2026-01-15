import { cp, rm, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const distRuntime = resolve('dist/runtime')
const targetRuntime = resolve('runtime')

try {
  await stat(distRuntime)
} catch {
  console.error('[copy-runtime] dist/runtime not found. Run the build first.')
  process.exit(1)
}

await rm(targetRuntime, { recursive: true, force: true })
await cp(distRuntime, targetRuntime, { recursive: true })
