<template>
  <div
    class="relative px-4 py-3 rounded-[20px] overflow-hidden z-30"
    :class="type === 'primary' ? 'top-primary' : type === 'secondary' ? 'top-secondary' : 'top-primary-light'"
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
    <div v-if="withDecoration" class="w-[120%] relative mt-2 -left-2 max-h-[12px]">
      <img :src="type === 'primary' ? DecorationPrimary : DecoratinSecondary" class="w-full h-full">
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error dn what is the problem
import DecorationPrimary from '@/assets/img/top-decoration-primary.svg?svg'
// @ts-expect-error dn what is the problem
import DecoratinSecondary from '@/assets/img/top-decoration-secondary.svg?svg'

defineProps<{
  type: 'primary' | 'secondary' | 'primary-light'
  withDecoration?: boolean
}>()
</script>

<style scoped>
.top-primary {
  background: var(--color-primary-2);
  box-shadow: 0px 0px 4px 4px var(--color-primary) inset;
}

.top-secondary {
  background: var(--color-secondary-3);
  box-shadow: 0px 0px 4px 4px var(--color-secondary) inset;
}

.top-primary-light {
  background: var(--color-primary);
  box-shadow: 0px 0px 4px 4px var(--color-primary) inset;

  background-image: url(@/assets/img/wave-bg.svg);
    background-size: auto 200px;
}
</style>
