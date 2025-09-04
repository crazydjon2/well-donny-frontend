import process from 'node:process'
import viteConfig from './vite.config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/storybook',
  ],
  css: ['./assets/css/tailwind.css', './assets/css/main.scss', 'vue-final-modal/style.css', 'vue3-carousel/carousel.css'],
  imports: {
    autoImport: false,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'https://localhost:8080',
      userTgId: process.env.USER_TG_ID,
    },
  },
  storybook: {
    port: 6006,
  },
  vite: viteConfig,
})
