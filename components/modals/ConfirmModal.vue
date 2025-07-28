<template>
  <ModalFull
    v-model="model"
    @close="emits('close')"
  >
    <div class="bg-white rounded-3xl w-full flex flex-col items-center p-4">
      <h3 class="text-small mb-1">
        {{ title }}
      </h3>
      <p class="text-regular text-center">
        {{ description }}
      </p>
      <div class="flex w-full gap-2 mt-5">
        <AppButton class="flex-[1]" :type="ButtonTypes.SECONDARY" outline full @click="emits('close')">
          {{ btnLeft }}
        </AppButton>
        <AppButton class="flex-[2]" full @click="emits('confirm')">
          {{ btnRight }}
        </AppButton>
      </div>
    </div>
  </ModalFull>
</template>

<script setup lang="ts">
import { ButtonTypes } from '~/assets/types/ui'
import AppButton from '../ui/AppButton.vue'
import ModalFull from './ModalFull.vue'

defineProps<{
  title: string
  description: string
  btnLeft: string
  btnRight: string
}>()

const emits = defineEmits<Emits>()
interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}
const model = defineModel<boolean>()
</script>
