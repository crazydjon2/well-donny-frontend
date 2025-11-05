// import process from 'node:process'
import viteConfig from './vite.config'
// import 'dotenv/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/storybook'],
  css: ['./assets/css/tailwind.css', './assets/css/main.scss', 'vue-final-modal/style.css', 'vue3-carousel/carousel.css'],
  imports: {
    autoImport: false,
  },
  storybook: {
    port: 6006,
  },
  app: {
    head: {
      script: [
        {
          src: 'https://telegram.org/js/telegram-web-app.js?59',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || '/',
    },
  },
  vite: viteConfig,
})
