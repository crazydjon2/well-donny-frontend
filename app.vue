<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  components: {

  },
  setup() {
    const { locale } = useI18n()
    const bool = ref(false)

    const onClick = () => {
      locale.value = locale.value === 'ru' ? 'en' : 'ru'
    }

    return { locale, onClick, bool }
  },
}
</script>
