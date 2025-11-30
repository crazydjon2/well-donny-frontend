<template>
  <ModalFull
    v-model="model"
    @close="emits('close')"
  >
    <div class="bg-white rounded-3xl w-full flex flex-col items-center p-4">
      <h3 class="text-small font-bold mb-2">
        {{ title }}
      </h3>
      <p class="text-regular text-center">
        {{ description }}
      </p>
      <slot />
      <div class="flex w-full gap-2 mt-5">
        <AppDelayedElement @click="emits('close')">
          <AppButton class="flex-[1]" :type="ButtonTypes.SECONDARY" outline full>
            {{ btnLeft }}
          </AppButton>
        </AppDelayedElement>
        <AppDelayedElement @click="emits('confirm')">
          <AppButton class="flex-[2]" full>
            {{ btnRight }}
          </AppButton>
        </AppDelayedElement>
      </div>
    </div>
  </ModalFull>
</template>

<script setup lang="ts">
import { ButtonTypes } from '~/assets/types/ui'
import { AppButton, AppDelayedElement } from '../ui'
import ModalFull from './ModalFull.vue'

defineProps<{
  title?: string
  description?: string
  btnLeft?: string
  btnRight?: string
}>()

const emits = defineEmits<Emits>()
interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}
const model = defineModel<boolean>()
</script>
