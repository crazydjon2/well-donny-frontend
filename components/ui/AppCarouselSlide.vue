<template>
  <div class="embla__slide" :class="opacity && 'opacity'">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps <{ perView?: number, opacity?: boolean }> ()

const slideSize = ref(`${100 / (props.perView || 1)}%`)
</script>

<style scoped lang="scss">
.embla__slide {
  transform: translate3d(0, 0, 0);
  flex: 0 0 v-bind(slideSize);
  min-width: 0;
  padding-left: var(--slide-spacing);

  transition: opacity 0.5s;
  &.opacity:not(.is-snapped) {
    opacity: 0.7;
  }
}
</style>
