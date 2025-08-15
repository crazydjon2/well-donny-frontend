<template>
  <div class="relative rounded-xl flex flex-col items-center" :class="[cardClasses]">
    <span class="text-regular font-bold text-white z-10">{{ description }}</span>
    <span class="text-[8rem] font-accent leading-[90px] font-bold text-white z-10">{{ percent }}%</span>
    <span class="text-regular font-bold text-white z-10">курса пройден</span>
    <img
      v-if="!isSecondary" src="@/assets/img/waves-secondary.svg?svg" alt="wave"
      class="absolute w-full h-full left-0 top-0 object-cover"
    >
    <template v-else>
      <img src="@/assets/img/wave-primary.svg?svg" alt="wave" class="absolute w-full bottom-[31px]">
      <img src="@/assets/img/wave-primary-2.svg?svg" alt="wave" class="absolute w-full bottom-[21px] z-20">
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ percent: number }>()

const description = computed(() => {
  if (props.percent < 1) {
    return 'Скорее в путь!'
  }
  else if (props.percent < 25) {
    return 'Это только начало...'
  }
  else if (props.percent < 52) {
    return 'Поднять паруса!'
  }
  else if (props.percent < 75) {
    return 'Больше половины!'
  }
  else if (props.percent < 100) {
    return 'Вижу сушу...'
  }
  return 'ЙО-ХО-ХО!'
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
