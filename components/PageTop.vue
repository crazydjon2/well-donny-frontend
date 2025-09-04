<template>
  <div
    class="relative px-4 py-3 rounded-[20px] overflow-hidden"
    :class="type === 'primary' ? 'bg-primary-2' : 'bg-secondary-3'"
  >
    <div class="flex items-center justify-center">
      <div class="">
        <slot name="left" />
      </div>
      <div class="font-accent text-white text-meduim text-center w-full">
        <slot />
      </div>
      <div class="justify-self-end">
        <slot name="right" />
      </div>
    </div>
    <Transition name="fade">
      <div v-if="withDecoration" class="w-[120%] relative mt-2 -left-2 max-h-[12px]">
        <img :src="type === 'primary' ? DecorationPrimary : DecoratinSecondary" class="w-full h-full">
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error dn what is the problem
import DecorationPrimary from '@/assets/img/top-decoration-primary.svg?svg'
// @ts-expect-error dn what is the problem
import DecoratinSecondary from '@/assets/img/top-decoration-secondary.svg?svg'

defineProps<{
  type: 'primary' | 'secondary'
  withDecoration?: boolean
}>()
</script>
