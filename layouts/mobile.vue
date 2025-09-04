<template>
  <div>
    <slot />
    <MobileMenu />
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import MobileMenu from '~/components/MobileMenu.vue'
</script>
