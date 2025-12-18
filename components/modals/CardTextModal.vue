<template>
  <VueFinalModal
    v-model="isOpen"
    class="flex justify-center items-center p-4"
    content-class="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transition-all duration-300 transform max-h-full"
    overlay-class="bg-black/50 transition-opacity duration-300"
    :overlay-transition="overlayTransition"
    :content-transition="contentTransition"
    @closed="close"
  >
    <div class="p-6 max-h-[90vh] overflow-auto">
      {{ modalData.text }}
    </div>

    <AppIcon icon="close" :width="24" :height="24" class="absolute right-2 top-2" @click="close" />
  </VueFinalModal>
</template>

<script setup lang="ts">
import { useModalStore } from '#imports'
import { storeToRefs } from 'pinia'
import { VueFinalModal } from 'vue-final-modal'
import { AppIcon } from '../ui'

const { isOpen, modalData } = storeToRefs(useModalStore())
const { close } = useModalStore()

const overlayTransition = {
  enterClass: 'ease-out duration-300',
  enterFromClass: 'opacity-0',
  enterToClass: 'opacity-100',
  leaveClass: 'ease-in duration-300',
  leaveFromClass: 'opacity-100',
  leaveToClass: 'opacity-0',
}

const contentTransition = {
  enterClass: 'ease-out duration-300',
  enterFromClass: 'opacity-0 scale-0',
  enterToClass: 'opacity-100 scale-100',
  leaveClass: 'ease-in duration-300',
  leaveFromClass: 'opacity-100 scale-100',
  leaveToClass: 'opacity-0 scale-30',
}
</script>
