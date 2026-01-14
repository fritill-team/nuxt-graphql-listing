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

    // ✅ Capture template outputs
    const enTpl = addTemplate({
      filename: 'nuxt-graphql-listing/i18n/locales/en.ts',
      src: resolver.resolve('./runtime/i18n/locales/en.ts'),
    })
    const arTpl = addTemplate({
      filename: 'nuxt-graphql-listing/i18n/locales/ar.ts',
      src: resolver.resolve('./runtime/i18n/locales/ar.ts'),
    })

    // ✅ Register using the template filenames (real .nuxt paths)

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        // ✅ absolute path to the folder that actually exists in your module
        langDir: resolver.resolve('./runtime/i18n/locales'),
        locales: [
          { code: 'en', file: 'en.ts' },
          { code: 'ar', file: 'ar.ts' },
        ],
      })
    })
  },
})
