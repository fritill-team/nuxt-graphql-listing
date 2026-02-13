export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui', '@nuxtjs/i18n', '@nuxt/content'],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic' },
    ],
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3
        }
      }
    }
  },

  devtools: {enabled: true},

  sourcemap: {
    server: false,
    client: false,
  },

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
