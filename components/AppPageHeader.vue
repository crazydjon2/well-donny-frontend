<template>
  <div class="bg-secondary py-1.5 px-10 relative flex items-center justify-center rounded-3xl">
    <span class="text-small text-white">{{ title }}</span>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
