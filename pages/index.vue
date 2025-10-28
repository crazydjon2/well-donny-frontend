<template>
  <div>
    <PageContainer page="main">
      <template #title>
        <h2 class="p-5 font-accent text-link-active text-[6rem] leading-[90px]">
          {{ $t('my-course') }}
        </h2>
      </template>
      <template #additional>
        <div class="flex w-full gap-7 px-10">
          <div class="w-full h-full bg-grey">
            DONNY
          </div>
          <AppDelayedElement
            to="/category/create"
            class="flex flex-col w-full min-h-[6rem] items-center justify-center bg-white border-primary-2 border-2 rounded-xl shadow-primary-dark"
          >
            <span class="text-regular uppercase font-bold">{{ $t('button.create') }}</span>
            <AppIcon icon="add" :width="30" :height="30" />
          </AppDelayedElement>
        </div>
      </template>
      <template #content-header>
        <div class="flex h-full gap-4 overflow-x-auto items-center w-full">
          <AppChip
            v-for="folder in categoryFolders" :key="folder.value" :active="folder.value === activeFolder"
            @click="setActiveFolder(folder.value)"
          >
            <p class="font-normal text-small">
              {{ folder.name }}
            </p>
          </AppChip>

          <AppIcon icon="plus" color="text-dark" class="mb-0.5 cursor-pointer" :width="16" :height="16" @click="folderModal = true" />
        </div>
      </template>
      <template #content>
        <div class="min-h-[100vh]">
          <Transition name="move-down-small">
            <div v-if="loading" class="grid grid-cols-2 gap-6 px-5 pt-5 w-full">
              <SkeletonLoader v-for="n in 4" :key="n" class="flex flex-col relative rounded-xl p-4 aspect-square" />
            </div>
            <div v-else-if="categories.length" class="grid grid-cols-2 gap-6 px-5 pt-5 w-full">
              <MotionComponent
                v-for="(category, index) in categories" :key="category.id"
                :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
                :leave="{ opacity: 0, scale: 0.8 }" :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
              >
                <AppDelayedElement :to="`/category/${category.category.id}`">
                  <AppCategoryCard
                    :category="category.category" :author="category.user"
                    :primary="!(index % 4 === 1 || index % 4 === 2)"
                  >
                    <template #default>
                      <div class="absolute right-4 bottom-5" @click.stop.prevent="beforeDelete(category.category.id)">
                        <AppIcon icon="trash" :width="16" :height="16" />
                      </div>
                    </template>
                  </AppCategoryCard>
                </AppDelayedElement>
              </MotionComponent>
            </div>
            <div v-else class="w-full">
              <div class="w-full bg-grey rounded-3xl aspect-square max-w-[300px] mx-auto" />
              <h2 class="font-accent text-[6rem] w-full text-center">
                Здесь пусто
              </h2>
            </div>
          </Transition>
        </div>
      </template>
    </PageContainer>
    <ConfirmModal
      v-model="modalOpen" :title="$t('attention')"
      :description="isCreator ? $t('delete-description') : $t('remove-description')" :btn-left="$t('button.cancel')"
      :btn-right="isCreator ? $t('button.delete') : $t('button.remove')" @close="modalOpen = false"
      @confirm="deleteCategory"
    />
    <CreateFolderModal v-model="folderModal" @on-create="onCreate" />
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore, useUserStore } from '#imports'
import { MotionComponent } from '@vueuse/motion'
import { storeToRefs } from 'pinia'

import { onMounted, ref, watch } from 'vue'

import AppCategoryCard from '~/components/AppCategoryCard.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import CreateFolderModal from '~/components/modals/CreateFolderModal.vue'
import PageContainer from '~/components/PageContainer.vue'
import SkeletonLoader from '~/components/SkeletonLoader.vue'
import { AppChip, AppDelayedElement, AppIcon } from '~/components/ui'

import { useCategoriesStore } from '~/stores/categories'

const { categories, categoryFolders, activeFolder, loading } = storeToRefs(useCategoriesStore())
const { user } = storeToRefs(useUserStore())
const { getCategories, setActiveFolder, getFolders } = useCategoriesStore()
const { deleteCategory: deleteCategoryMethod, removeUserFromCategory } = useCategoryStore()

const modalOpen = ref<boolean>(false)
const folderModal = ref<boolean>(false)

const categoryId = ref<string>('')
const isCreator = ref(false)
function beforeDelete(id: string) {
  categoryId.value = id
  isCreator.value = categories.value.find(c => c.category.id === categoryId.value)?.role === 'creator'
  modalOpen.value = true
}
function deleteCategory() {
  if (isCreator.value) {
    deleteCategoryMethod(categoryId.value)
      .then(() => {
        modalOpen.value = false
        getCategories()
      })
  }
  else {
    if (user.value) {
      removeUserFromCategory(user.value?.id, categoryId.value)
        .then(() => {
          modalOpen.value = false
          getCategories()
        })
    }
  }
}

function onCreate() {
  getFolders()
  getCategories()
}

onMounted(() => {
  getFolders()
})

watch(activeFolder, () => {
  getCategories()
}, { immediate: true })
</script>
