<template>
  <ModalFull v-model="model" @close="model = false">
    <div class="bg-white rounded-3xl w-full h-[70vh]">
      <div class="p-4 h-full flex flex-col">
        <h2 class="text-small font-bold">
          Добавление новой папки
        </h2>
        <AppInput v-model="name" class="mt-4" outline placeholder="Название папки" :error="errors?.name && errors.name[0]" />

        <div class="flex gap-4 overflow-x-auto items-center mt-5">
          <AppChip
            v-for="folder in baseFolders" :key="folder.value" :active="folder.value === activeFolder"
            @click="activeFolder = folder.value"
          >
            <p class="font-normal text-small">
              {{ folder.name }}
            </p>
          </AppChip>
        </div>

        <div class="flex flex-col gap-3 mt-4 max-h-[45%] overflow-y-auto overflow-x-hidden">
          <MotionComponent
            v-for="category in categories" :key="category.id" class="w-full" :initial="{ opacity: 0.2, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
            :leave="{ opacity: 0, scale: 0.8 }" :transition="{ type: 'spring', stiffness: 200, damping: 20 }" :duration="300"
          >
            <div class="flex items-center justify-center w-full" @click="resolveCategory(category.category.id)">
              <span class="text-regular font-bold">{{ category.category.name }}</span>
              <AppCheckbox :value="pickedCategories?.includes(category.category.id)" class="ml-auto" />
            </div>
          </MotionComponent>
        </div>
        <p class="text-red text-small mt-auto">{{ errors?.categories[0] }}</p>

        <div class="mt-auto flex w-full gap-4">
          <AppDelayedElement class="w-full" @click="model = false">
            <AppButton outline :type="ButtonTypes.SECONDARY" full>
              отмена
            </AppButton>
          </AppDelayedElement>
          <AppDelayedElement class="w-full" @click="createFolder">
            <AppButton full>
              сохранить
            </AppButton>
          </AppDelayedElement>
        </div>
      </div>
    </div>
  </ModalFull>
</template>

<script setup lang="ts">
import type { UsersCategory } from '~/assets/types/usersCategories'
import { MotionComponent } from '@vueuse/motion'
import { computed, ref, watch } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'
import { folderService } from '~/services/folderService'
import { useCategoriesStore } from '~/stores/categories'
import { AppButton, AppCheckbox, AppChip, AppDelayedElement, AppInput } from '../ui'
import ModalFull from './ModalFull.vue'

const props = defineProps<{ folderId?: string }>()
const emits = defineEmits(['onCreate'])
const model = defineModel<boolean>()
const { baseFolders } = useCategoriesStore()

const activeFolder = ref<number | string>(0)
const activeFolderData = computed(() => {
  return baseFolders.find(c => c.value === activeFolder.value)
})
const categories = ref<UsersCategory[]>([])

const name = ref<string>('')
const pickedCategories = ref<string[]>([])

function resolveCategory(id: string) {
  if (pickedCategories.value?.includes(id)) {
    pickedCategories.value = pickedCategories.value.filter(pc => pc !== id)
  }
  else {
    pickedCategories.value = [...pickedCategories.value, id]
  }
}

watch(activeFolder, async () => {
  if (activeFolderData.value) {
    categories.value = await useCategoriesStore().getCategoryByFolder(activeFolderData.value)
  }
}, { immediate: true })

const errors = ref<{ name: string, categories: string } | null>()
const editMode = ref(false)
const folderLoading = ref(false)
watch(() => props.folderId, async () => {
  if (props.folderId) {
    folderLoading.value = true
    editMode.value = true
    const { data } = await folderService.getFolder(props.folderId)
    if (data.value) {
      name.value = data.value.name
      pickedCategories.value = data.value.categories.map(c => c.id)
    }
    folderLoading.value = false
  }
  else {
    editMode.value = false
    name.value = ''
    pickedCategories.value = []
  }
  errors.value = null
})

watch(model, () => {
  errors.value = null
})

async function createFolder() {
  errors.value = null
  if (editMode.value && props.folderId) {
    const { error } = await folderService.editFolder(name.value, pickedCategories.value, props.folderId)
    if (error.value) {
      errors.value = error.value.data.errors
    }
    else {
      model.value = false
      emits('onCreate')
    }
  }
  else {
    const { error } = await folderService.createFolder(name.value, pickedCategories.value)
    if (error.value) {
      errors.value = error.value.data.errors
    }
    else {
      model.value = false
      emits('onCreate')
    }
  }
}
</script>
