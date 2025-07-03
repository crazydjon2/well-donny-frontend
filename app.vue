<template>
  <div class="py-8">
    <div class="cursor-pointer" @click="onClick">{{ locale }}</div>
    {{ $t('text') }}
    <AppButton disabled/>
    <AppIcon icon="refresh" />
    <AppCheckbox v-model="bool" text="aaaa" />
    <div class="mx-auto max-w-[350px]">
      <AppCard text-first="aaa" text-second="FFF" large />
    </div>
    <div class="mx-auto max-w-[225px]">
      <AppCard text-first="xxx" text-second="ccc" :large="false" />
    </div>
    <NuxtPage />
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { AppButton, AppIcon, AppCheckbox } from './components/ui/index';
import AppCard from './components/AppCard.vue';
import { ref } from 'vue';

export default {
  components: {
    AppButton,
    AppIcon,
    AppCheckbox,
    AppCard,
  },
  setup() {
    const { locale } = useI18n()
    const bool = ref(false)

    const onClick = () => {
      locale.value = locale.value === 'ru' ? 'en' : 'ru'
    }

    return { locale, onClick, bool }
  }
}
</script>
