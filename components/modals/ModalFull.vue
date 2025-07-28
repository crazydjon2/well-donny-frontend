<template>
  <VueFinalModal
    v-model="model"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    class="flex justify-center items-center w-full"
    content-class="w-full p-4"
    @closed="emits('close')"
  >
    <slot />
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

const emits = defineEmits<Emits>()

const model = defineModel<boolean>()

interface Emits {
  (e: 'close'): void
}
</script>
