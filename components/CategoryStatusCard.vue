<template>
  <div class="relative rounded-xl flex flex-col items-center" :class="[cardClasses]">
    <span class="text-regular font-bold text-white z-10 text-center">{{ description }}</span>
    <span class="relative w-full text-[6rem] font-accent leading-[4rem] font-bold text-white">
      <p class="relative text-center z-20">{{ Math.round(percent) }}%</p>
      <template v-if="isSecondary">
        <img src="@/assets/img/wave-primary.svg?svg" alt="wave" class="absolute w-full bottom-[5px]">
        <img src="@/assets/img/wave-primary-2.svg?svg" alt="wave" class="absolute w-full -bottom-[5px] z-20">
      </template>
    </span>
    <span class="text-regular font-bold text-white z-10">{{ $t('category-status.done') }}</span>
    <img
      v-if="!isSecondary" src="@/assets/img/waves-secondary.svg?svg" alt="wave"
      class="absolute w-full h-full left-0 top-0 object-cover rounded-xl"
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ percent: number }>()
const { t } = useI18n()
const description = computed(() => {
  if (props.percent < 1) {
    return t('category-status.state.1')
  }
  else if (props.percent < 25) {
    return t('category-status.state.2')
  }
  else if (props.percent < 52) {
    return t('category-status.state.3')
  }
  else if (props.percent < 75) {
    return t('category-status.state.4')
  }
  else if (props.percent < 100) {
    return t('category-status.state.5')
  }
  return t('category-status.state.6')
})

const isSecondary = computed(() => {
  return props.percent > 52
})

const cardClasses = computed(() => {
  return {
    'bg-secondary': !isSecondary.value,
    'bg-primary': isSecondary.value,
  }
})
</script>
