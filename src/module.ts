import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

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

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('runtime')

    if (options.components !== false) {
      addComponentsDir({
        path: resolver.resolve('runtime/components'),
        global: true,
        pathPrefix: true,
      })
    }

    if (options.autoImports !== false) {
      addImportsDir(resolver.resolve('runtime/composables'))
      addImportsDir(runtimeDir)
    }

    nuxt.options.build.transpile ||= []
    nuxt.options.build.transpile.push(runtimeDir)
  },
})
