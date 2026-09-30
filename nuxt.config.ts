export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Noto+Sans+Malayalam': [400, 500, 600, 700]
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
