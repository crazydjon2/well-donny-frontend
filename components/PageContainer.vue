<template>
  <div class="max-h-[100vh] h-[100vh] overflow-hidden">
    <div
      class="background-wave w-full top-0 z-40 transition-all overflow-hidden ease-in-out"
      :class="[page === 'library' ? 'bg-secondary' : 'bg-primary']"
    >
      <div>
        <slot name="title" />
      </div>

      <div class="w-full gap-7 min-h-[160px]">
        <slot name="additional" />
      </div>
    </div>
    <div
      ref="container" class="relative z-50 bg-white rounded-t-3xl overflow-y-scroll transition-transform ease-in-out duration-250"
      :class="isScrollingDown ? ['h-[calc(100vh-105px)]', '-translate-y-[175px]'] : ['h-[calc(100vh-241px)]',  '-translate-y-[44px]']"
    >
      <div class="min-h-[100vh] pb-30">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<!-- TODO:
1. ADD OFFEST FOR UP SCROLL
2. FIX FAST SCROLL DOWN TO THE END OF THE PAGE -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ page: 'library' | 'main' }>()

const isScrollingDown = ref(false)
const lastStopPoint = ref(0)

const container = ref()
function handleScroll() {
  const scrollY = container.value.scrollTop

  if (lastStopPoint.value - scrollY > 75 || scrollY === 0) {
    isScrollingDown.value = false
  }
  else if (lastStopPoint.value - scrollY < -10) {
    isScrollingDown.value = true
  }
  lastStopPoint.value = scrollY
}

onMounted(() => {
  container.value.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  container.value.removeEventListener('scroll', handleScroll)
})
</script>

<style></style>
