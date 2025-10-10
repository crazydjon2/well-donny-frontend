import { defineNuxtPlugin } from '#app'
import { setupCalendar } from 'v-calendar'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(setupCalendar, {})
})
