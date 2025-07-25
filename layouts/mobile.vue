<template>
  <div class="py-7 px-5 pb-[150px]">
    <slot />
    <MobileMenu />
  </div>
</template>

<script setup lang="ts">
import MobileMenu from '~/components/MobileMenu.vue'
</script>
