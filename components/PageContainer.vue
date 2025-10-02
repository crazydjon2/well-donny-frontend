<template>
  <div class="">
    <div
      class="background-wave fixed w-full top-0 z-40 transition-all overflow-hidden ease-in-out"
      :class="[page === 'library' ? 'bg-secondary' : 'bg-primary']"
      :style="{ height: isScrollingDown ? '175px' : '290px' }"
    >
      <slot name="title" />

      <transition name="fade">
        <div v-show="!isScrollingDown" class="flex w-full gap-7 duration-150">
          <slot name="additional" />
        </div>
      </transition>
      <div class="absolute bottom-[-1px] w-full bg-white rounded-t-3xl h-[44px]">
        <slot name="content-header" />
      </div>
    </div>
    <div
      class="relative z-30 bg-white rounded-t-3xl pt-6 transition-all overflow-auto"
      :class="!isScrollingDown ? 'mt-[290px]' : 'mt-[174px]'"
    >
      <slot name="content" />
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

function handleScroll() {
  const scrollY = window.scrollY

  if (lastStopPoint.value - scrollY > 75 || scrollY === 0) {
    isScrollingDown.value = false
  }
  else if (lastStopPoint.value - scrollY < -10) {
    isScrollingDown.value = true
  }
  lastStopPoint.value = scrollY
}

onMounted(() => {
  document.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll)
})
</script>

<style>

</style>
