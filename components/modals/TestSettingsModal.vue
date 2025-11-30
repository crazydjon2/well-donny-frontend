<template>
  <ModalFull
    v-model="model"
    @close="emits('close')"
  >
    <div class="bg-white rounded-3xl w-full flex flex-col items-center p-4 relative">
      <AppIcon icon="close" :width="20" :height="20" color="text-white" class="z-200 absolute top-8 right-8" @click="model = false" />
      <PageTop type="secondary" class="w-full" with-decoration>
        <p>настройка теста</p>
      </PageTop>
      <p class="mt-5 border-b-[1px] text-small w-full">
        {{ title }}
      </p>

      <div class="flex justify-between w-full mt-5" @click="isReverse = !isReverse">
        Обратный порядок
        <AppCheckbox :value="isReverse" />
      </div>

      <AppButton full class="mt-10" @click="runTest">
        начать тест
      </AppButton>
    </div>
  </ModalFull>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageTop from '../PageTop.vue'
import { AppButton, AppCheckbox, AppIcon } from '../ui'
import ModalFull from './ModalFull.vue'
import { categoryService } from '~/services/categoryService';

const props = defineProps<{
  title?: string
	isReverse: boolean
  categoryId: string
}>()

const emits = defineEmits<Emits>()
interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}
const model = defineModel<boolean>()

const isReverse = ref(props.isReverse)

function runTest() {
	categoryService.setOrder(props.categoryId, isReverse.value)
		.then(() => {
			window.location.reload()
		})
}
</script>
