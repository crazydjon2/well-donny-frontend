<template>
  <div>
    <div>
      <slot />
    </div>
    <Transition name="move-up">
      <MobileMenu v-if="isMenuVisible" />
    </Transition>
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '#imports'
import { storeToRefs } from 'pinia'
import { ModalsContainer } from 'vue-final-modal'
import MobileMenu from '~/components/MobileMenu.vue'

const { isMenuVisible } = storeToRefs(useGlobalStore())
</script>

<style>
.page-left-enter-active,
.page-right-enter-active,
.page-left-leave-active,
.page-right-leave-active {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.page-left-enter-from {
  transform: translateX(100%) rotateY(-10deg);
  opacity: 0.6;
}

.page-right-leave-to {
  transform: translateX(100%) rotateY(-5deg);
  opacity: 0.6;
}

.page-left-leave-to {
  transform: translateX(-50%) rotateY(5deg) scale(0.95);
  opacity: 0;
}

.page-right-enter-from {
  transform: translateX(-50%) rotateY(5deg) scale(0.95);
  opacity: 0;
}

.page-left-enter-to,
.page-right-enter-to {
  transform: translateX(0) rotateY(0) scale(1);
  opacity: 1;
}

.page-left-leave-from,
.page-right-leave-from {
  transform: translateX(0) rotateY(0) scale(1);
  opacity: 1;
}
</style>
