// import process from 'node:process'
import viteConfig from './vite.config'
// import 'dotenv/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/storybook'],
  css: ['./assets/css/tailwind.css', './assets/css/main.scss', 'vue-final-modal/style.css'],
  imports: {
    autoImport: false,
  },
  storybook: {
    port: 6006,
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
        },
      ],
      script: [
        {
          src: 'https://telegram.org/js/telegram-web-app.js?59',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/prefer-global/process
      baseUrl: process.env.BASE_URL || '/',
    },
  },
  vite: viteConfig,
})
