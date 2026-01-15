import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    MyModule,
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic' },
    ],
  },
})
