<template>
  <transition name="fade">
    <div v-if="loader" class="fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-100">
      <div class="p-4 bg-primary rounded-2xl loader-container">
        <img src="/icon/loader.svg?svg" class="w-[4.75rem] h-[4.75rem]">
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useGlobalStore } from '#imports'
import { storeToRefs } from 'pinia'

const { loader } = storeToRefs(useGlobalStore())
</script>

<style scoped>
.loader-container {
  box-shadow: 0px -1px 12px 2px rgba(34, 60, 80, 0.5);
}

.loader-container img {
  transition: all 0.8s ease;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(360deg);
  }
}
</style>
