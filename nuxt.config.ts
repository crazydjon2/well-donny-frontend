export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@pinia/nuxt"
  ],
  css: ["./assets/css/tailwind.css", "./assets/css/main.scss"],
  imports: {
    autoImport: false,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  }
});
