<template>
  <div ref="emblaRef" class="embla">
    <div class="embla__container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import ClassNames from 'embla-carousel-class-names'
import emblaCarouselVue from 'embla-carousel-vue'

const props = withDefaults(defineProps<{ loop?: boolean, align?: 'start' | 'end' | 'center' }>(), {
  align: 'center',
})

const [emblaRef] = emblaCarouselVue({ loop: props.loop, align: props.align }, [ClassNames()])
</script>

<style scoped>
.embla {
    overflow-x: hidden;
  /* max-width: 48rem; */
  margin: auto;
  --slide-height: 19rem;
  --slide-spacing: 1rem;
  --slide-size: 70%;
}
.embla__viewport {
  overflow: hidden;
}
.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}
</style>
