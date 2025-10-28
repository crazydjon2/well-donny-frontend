<template>
  <ModalFull v-model="model" @close="model = false">
    <div class="bg-white rounded-3xl w-full h-[50vh]">
      <div class="p-4 h-full flex flex-col">
        <h2 class="text-small font-bold">
          Добавление новой папки
        </h2>
        <AppInput v-model="name" class="mt-4" outline placeholder="Название папки" />

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

        <div class="flex flex-col gap-3 mt-4 max-h-[45%] overflow-y-auto">
          <TransitionGroup name="move-left-small">
            <div v-for="category in categories" :key="category.id" class="w-full">
              <div class="flex items-center justify-center w-full" @click="resolveCategory(category.category.id)">
                <span class="text-regular font-bold">{{ category.category.name }}</span>
                <AppCheckbox :value="pickedCategories?.includes(category.category.id)" class="ml-auto" />
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div class="mt-auto flex w-full gap-4">
          <AppButton outline :type="ButtonTypes.SECONDARY" @click="model = false">
            отмена
          </AppButton>
          <AppButton full @click="createFolder">
            сохранить
          </AppButton>
        </div>
      </div>
    </div>
  </ModalFull>
</template>

<script setup lang="ts">
import type { UsersCategory } from '~/assets/types/usersCategories'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'
import { folderService } from '~/services/folderService'
import { useCategoriesStore } from '~/stores/categories'
import { AppButton, AppCheckbox, AppChip, AppInput } from '../ui'
import ModalFull from './ModalFull.vue'

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
    pickedCategories.value?.push(id)
  }
}

function createFolder() {
  if (name.value) {
    folderService.createFolder(name.value, pickedCategories.value)
      .then(() => {
        model.value = false
        emits('onCreate')
      })
  }
}

watch(activeFolder, async () => {
  if (activeFolderData.value) {
    categories.value = await useCategoriesStore().getCategoryByFolder(activeFolderData.value)
  }
}, { immediate: true })
</script>
