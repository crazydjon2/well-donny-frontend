<template>
  <div class="max-h-[100vh] overflow-hidden">
    <div
      class="background-wave sticky top-0 z-20 overflow-hidden transition-all duration-200 ease-in-out"
      :class="[page === 'library' ? 'bg-secondary' : 'bg-primary']" :style="{
        height: isScrollingDown ? '150px' : '280px',
      }"
    >
      <slot name="title" />

      <div class="flex w-full gap-7 px-10 transition-opacity duration-200">
        <slot name="additional" />
      </div>
    </div>
    <div
      id="aaa" class="relative z-30 bg-white rounded-t-3xl -mt-6 transition-all duration-200 overflow-auto" :style="{
        height: isScrollingDown ? 'calc(100vh - 150px)' : 'calc(100vh - 280px)',
      }"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ page: 'library' | 'main' }>()

// TODO
// ADD CONSTANT
// MAKE IT MORE STABLE
const isScrollingDown = ref(false)
let timer: NodeJS.Timeout
const lastScrollY = ref<number>(0)
const scrollLatency = ref(true)

function handleScroll() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const currentScrollY = document.querySelector('#aaa')?.scrollTop || 0

    // console.log(Math.abs(currentScrollY), Math.abs((lastScrollY.value)), zeroLatency.value)
    // if (currentScrollY === 0 && zeroLatency.value) {
    //   isScrollingDown.value = false
    // }
    if (scrollLatency.value) {
      if (lastScrollY.value - currentScrollY > 100 || currentScrollY < 10) {
        isScrollingDown.value = false
      }
      else if (lastScrollY.value - currentScrollY < 0) {
        isScrollingDown.value = true
      }
      scrollLatency.value = false
      setTimeout(() => {
        scrollLatency.value = true
      }, 401)

      lastScrollY.value = currentScrollY || 0
    }
  }, 100)
}

onMounted(() => {
  // lastScroll = window.scrollY
  const container = document.querySelector('#aaa')
  if (container) {
    container.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  const container = document.querySelector('#aaa')
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style>

</style>
