import { defineNuxtPlugin } from '#app'
import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import ru from '../locales/ru.json'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
    ru,
  },
})

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(i18n)
})
