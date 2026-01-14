export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui', '@nuxtjs/i18n'],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic' },
    ],
  },

  devtools: {enabled: true},


  css: ['../assets/css/main.css'],
  runtimeConfig: {
    public: {
      authUrl: 'https://auth.d.itqadem.com/realms/Itqadem/protocol/openid-connect/token',
      authClientId: 'frontend-admin',
      coursesDevMode: false,
      coursesBaseUrl: ''
    }
  }
})
