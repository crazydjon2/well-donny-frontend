<template>
  <div>
    <img src="@/assets/img/boat.png" class="w-[62px] h-[62px] translate-y-2.5 relative ship-img" :class="{ 'ship-animation-stop': !animation }" :style="offset">
    <div class="h-[12px] w-full bg-primary rounded-sm" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ length: number, position: number }>()

const offset = computed(() => {
  return `left: ${Math.min(92, (100 / props.length) * (props.position - 1))}%`
})

const animation = ref(false)
watch(() => props.position, () => {
  animation.value = true
  setTimeout(() => {
    animation.value = false
  }, 4000)
})
</script>
  
<style scoped>
.ship-img {
  transition: 1s;
  animation: ship-wave-live infinite 7s ease-in-out;
  transform-origin: 50% 100%; /* центр внизу – как будто стоит на воде */
  will-change: transform;
}

.ship-animation-stop {
animation-play-state: paused;
}

@keyframes ship-wave-live {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  15% {
    transform: translate(1px, 2px) rotate(2deg);
  }
  30% {
    transform: translate(-1px, 2px) rotate(-1.5deg);
  }
  45% {
    transform: translate(1px, 3px) rotate(2.5deg);
  }
  60% {
    transform: translate(-1px, 2px) rotate(-2deg);
  }
  75% {
    transform: translate(0px, 1px) rotate(1.5deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(0deg);
  }
}
</style>
