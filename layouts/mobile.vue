<template>
  <div>
    <slot />
    <Transition name="move-up">
      <MobileMenu v-if="isMenuVisible" />
    </Transition>
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '#imports';
import { storeToRefs } from 'pinia';
import { ModalsContainer } from 'vue-final-modal'
import MobileMenu from '~/components/MobileMenu.vue'

const { isMenuVisible } = storeToRefs(useGlobalStore())
</script>
