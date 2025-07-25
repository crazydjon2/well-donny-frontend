import antfu from '@antfu/eslint-config'
import globals from 'globals'

export default antfu({
  rules: {
    'vue/block-order': 'off',
  },
  overrides: [
    {
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
    },
  ],
})
