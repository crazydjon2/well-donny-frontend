<template>
  <div>
    <div class="cursor-pointer" @click="onClick">{{ locale }}</div>
    {{ $t('text') }}
    <NuxtPage />
  </div>
</template>

<script lang="ts">
import { useI18n } from '#imports';

export default {
  setup() {
    const { locale } = useI18n()

    const onClick = () => {
      locale.value = locale.value === 'ru' ? 'en' : 'ru'
    }

    return { locale, onClick }
  }
}
</script>
