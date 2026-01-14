// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-04',

  modules: ["@nuxt/content", "@nuxt/ui", "@nuxtjs/i18n"],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic' },
    ],
  },



  css: [
    './assets/css/main.css',
  ]
})
