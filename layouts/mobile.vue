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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.4s ease-in;
}

.page-left-enter-from,
.page-right-leave-to {
  transform: translateY(100%);
}

.page-left-leave-to,
.page-right-enter-from {
  transform: translateY(-100%);
}

.page-left-enter-to,
.page-right-enter-to {
  transform: translateY(0);
}
</style>
