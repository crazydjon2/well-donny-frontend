import { defineNuxtPlugin, useCookie } from '#app'
import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import ru from '../locales/ru.json'

// Создаем переменную для i18n, но инициализируем позже
let i18nInstance: ReturnType<typeof createI18n>

export default defineNuxtPlugin(({ vueApp }) => {
  // useCookie() должен вызываться ТОЛЬКО внутри функции плагина
  const locale = useCookie('locale')

  i18nInstance = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale.value || 'ru',
    messages: {
      en,
      ru,
    },
  })

  vueApp.use(i18nInstance)

  return {
    provide: {
      i18n: i18nInstance.global,
    },
  }
})

// Экспортируем getter для i18n instance, если нужно использовать вне компонентов
export const i18n = () => i18nInstance
