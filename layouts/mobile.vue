<template>
  <div class="py-7 px-5 pb-[150px] max-w-[700px] mx-auto overflow-x-hidden">
    <slot />
    <MobileMenu />
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import MobileMenu from '~/components/MobileMenu.vue'
</script>
