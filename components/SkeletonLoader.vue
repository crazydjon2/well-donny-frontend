<template>
  <div
    class="skeleton-loader"
    :style="{
      width,
      height,
      borderRadius,
    }"
  />
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  borderRadius?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  borderRadius: '4px',
})
</script>

<style scoped>
.skeleton-loader {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
