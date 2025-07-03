import { setup } from "@storybook/vue3";
import { i18n } from '../plugins/i18n'

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'ru', title: 'Русский' }
      ],
      showName: true
    }
  }
}

export const decorators = [
  (story, context) => {
    i18n.global.locale.value = context.globals.locale
    return story()
  }
]

setup(async (app) => {
  app.use(i18n)
});
