<!-- TODO add first frame form lottie animation -->
<template>
  <Transition name="fade">
    <div v-if="isLightHouse" class="w-full h-full fixed top-0 left-0 z-50 bg-dark/70 px-10">
      <Transition name="fade" appear>
        <div v-if="showAnimation" class="flex items-center justify-center w-full h-full">
          <ClientOnly>
            <Vue3Lottie :animation-data="lightHouseAnimation" />
          </ClientOnly>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import lightHouseAnimation from '@/assets/test.json'
import { useGlobalStore } from '~/stores/global'

const { isLightHouse } = storeToRefs(useGlobalStore())
const showAnimation = ref(false)

onMounted(async () => { // даём контейнеру смонтироваться
  showAnimation.value = true
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .5s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
