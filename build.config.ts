import { cp } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  hooks: {
    'rollup:done': async (ctx) => {
      const rootDir = ctx.options.rootDir || process.cwd()
      const outDir = ctx.options.outDir || 'dist'
      await cp(
        resolve(rootDir, 'src/runtime/package.json'),
        resolve(rootDir, outDir, 'runtime/package.json'),
      )
      await cp(
        resolve(rootDir, 'src/runtime/composables/package.json'),
        resolve(rootDir, outDir, 'runtime/composables/package.json'),
      )
    },
  },
})
