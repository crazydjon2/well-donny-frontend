import process from 'node:process'
import { useRuntimeConfig } from '#app'
import viteConfig from './vite.config'
import 'dotenv/config'

const config = useRuntimeConfig()
console.log(config.public.baseURL)
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
    baseURL: process.env.BASE_URL, // серверная часть
    userTgId: process.env.USER_TG_ID,
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:8080/',
      userTgId: process.env.USER_TG_ID,
    },
  },
  storybook: {
    port: 6006,
  },
  vite: viteConfig,
})
