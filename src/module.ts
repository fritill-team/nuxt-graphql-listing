import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export interface ModuleOptions {
  components?: boolean
  autoImports?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-graphql-listing',
    configKey: 'graphqlListing',
  },
  defaults: {
    components: true,
    autoImports: true,
  },
  moduleDependencies: {
    '@nuxtjs/i18n': {},
    '@nuxt/ui': {},
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('runtime')
    const packagedRuntimeDir = resolver.resolve('../runtime')
    const resolvedRuntimeDir = existsSync(packagedRuntimeDir) ? packagedRuntimeDir : runtimeDir

    if (options.components !== false) {
      addComponentsDir({
        path: resolve(resolvedRuntimeDir, 'components'),
        global: true,
        pathPrefix: true,
      })
    }

    if (options.autoImports !== false) {
      addImportsDir(resolve(resolvedRuntimeDir, 'composables'))
      addImportsDir(resolvedRuntimeDir)
    }

    nuxt.options.build.transpile ||= []
    nuxt.options.build.transpile.push(resolvedRuntimeDir)

    // Register i18n locales
    const localesDir = resolve(resolvedRuntimeDir, 'i18n/locales')

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: localesDir,
        locales: [
          { code: 'en', file: 'en.json' },
          { code: 'ar', file: 'ar.json' },
        ],
      })
    })
  },
})
