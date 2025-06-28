export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["./assets/css/tailwind.css", "./assets/css/main.scss"],
  imports: {
    autoImport: false,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "https://api.example.com/",
    },
  },
  i18n: {
    defaultLocale: "ru",
    langDir: "../locales/",
    strategy: 'no_prefix',
    locales: [
      { code: "en", language: "en-US", file: 'en.js' },
      { code: "ru", language: "ru-RU", file: 'ru.js' },
    ],
  },
  vite: {
    assetsInclude: ["**/*.json"],
  },
});
