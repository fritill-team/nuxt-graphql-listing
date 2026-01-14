export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui', '@nuxt/image'],

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
