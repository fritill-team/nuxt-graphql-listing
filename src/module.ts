import {
  addComponentsDir,
  addImportsDir,
  addTemplate,
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
  moduleDependencies: {
    '@nuxtjs/i18n': {},
    '@nuxt/ui': {},
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

    addTemplate({
      filename: 'nuxt-graphql-listing/i18n/locales/en.ts',
      src: resolver.resolve('./runtime/i18n/locales/en.ts'),
    })
    addTemplate({
      filename: 'nuxt-graphql-listing/i18n/locales/ar.ts',
      src: resolver.resolve('./runtime/i18n/locales/ar.ts'),
    })

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolver.resolve('./runtime/i18n/locales'),
        locales: [
          { code: 'en', file: 'en.ts' },
          { code: 'ar', file: 'ar.ts' },
        ],
      })
    })

  },
})
