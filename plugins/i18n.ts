import { defineNuxtPlugin, useCookie } from '#app'
import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import ru from '../locales/ru.json'

const locale = useCookie('locale')

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: locale.value || 'ru',
  messages: {
    en,
    ru,
  },
})

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(i18n)
})
