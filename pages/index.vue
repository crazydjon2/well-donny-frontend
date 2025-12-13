<template>
  <div>
    <PageContainer page="main">
      <template #title>
        <h2 class="p-5 font-accent text-link-active text-[6rem] leading-[90px]">
          {{ $t('my-course') }}
        </h2>
      </template>
      <template #additional>
        <div class="gap-7 px-10">
          <!-- <div class="w-full h-full animation-swim">
            <img src="@/assets/img/donny.PNG" alt="Donny">
          </div> -->
          <AppDelayedElement
            to="/category/create"
            class="flex flex-col ml-auto !w-[160px] h-[6rem] items-center justify-center bg-white border-primary-2 border-2 rounded-xl shadow-primary-dark"
          >
            <span class="text-regular uppercase font-bold">{{ $t('button.create') }}</span>
            <AppIcon icon="add" :width="30" :height="30" />
          </AppDelayedElement>
        </div>
      </template>
      <template #content>
        <div class="flex items-center !rounded-t-3xl h-[44px] px-4 overflow-hidden sticky bg-white top-0 z-60">
          <div id="folder-container" class="flex h-full gap-4 overflow-x-auto items-center w-[calc(100%-40px)]">
            <AppChip
              v-for="folder in categoryFolders" :id="`folder-${folder.value}`" :key="folder.value"
              :active="folder.value === activeFolder" @click="setActiveFolder(folder.value)"
            >
              <div class="flex items-center justify-center">
                <p class="font-normal text-small">
                  {{ folder.name }}
                </p>

                <!-- TODO
                ADD tRANSItiON -->
                <Transition>
                  <Dropdown
                    v-if="folder.custom && folder.value === activeFolder"
                    :disabled="folderModal || folderDeleteModal" class="ml-1 mb-1"
                  >
                    <AppIcon icon="settings" :width="18" :height="18" />
                    <template #popper>
                      <div class="p-5 px-7 gap-3 flex flex-col rounded-xl">
                        <p class="text-small text-center border-b-1" @click="editFolder(folder)">
                          {{ $t('button.edit') }}
                        </p>
                        <p class="text-small text-center border-b-1" @click="folderDeleteModal = true">
                          {{ $t('button.delete') }}
                        </p>
                      </div>
                    </template>
                  </Dropdown>
                </Transition>
              </div>
            </AppChip>
          </div>
          <AppButton :type="ButtonTypes.SECONDARY" outline small class="flex items-center justify-center ml-2 mb-1.5">
            <AppIcon
              icon="plus" color="text-dark" class="p-1 cursor-pointer" :width="16" :height="16"
              @click="folderToEdit = null; folderModal = true"
            />
          </AppButton>
        </div>
        <Transition name="move-down-small">
          <div v-if="loading" class="grid grid-cols-2 gap-6 px-5 mt-5 w-full">
            <SkeletonLoader v-for="n in 4" :key="n" class="flex flex-col relative rounded-xl p-4 aspect-square" />
          </div>
          <div v-else-if="categories.length" class="grid grid-cols-2 gap-6 px-5 pt-5 w-full">
            <template
              v-for="(category, index) in categories" :key="category.id"
            >
              <NuxtLink :to="`/category/${category.category.id}`">
                <AppCategoryCard
                  :category="category.category" :author="category.author"
                  :primary="!(index % 4 === 1 || index % 4 === 2)"
                  :rate="category.rate"
                >
                  <template #default>
                    <div class="absolute right-4 bottom-5" @click.stop.prevent="beforeDelete(category.category.id)">
                      <AppIcon icon="trash" :width="16" :height="16" />
                    </div>
                  </template>
                </AppCategoryCard>
              </NuxtLink>
            </template>
          </div>
          <div v-else class="w-full">
            <!-- <div class="w-full bg-grey rounded-3xl aspect-square max-w-[300px] mx-auto" /> -->
            <img src="/assets//img//donny-sad.jpg" alt="Sad Donny" class="max-h-[250px] mx-auto mt-6 animation-swim" />
            <h2 class="font-accent text-[6rem] w-full text-center">
              {{ $t('empty') }}
            </h2>
          </div>
        </Transition>
      </template>
    </PageContainer>
    <ConfirmModal
      v-model="modalOpen" :title="$t('attention')"
      :description="isCreator ? $t('delete-description') : $t('remove-description')" :btn-left="$t('button.cancel')"
      :btn-right="isCreator ? $t('button.delete') : $t('button.remove')" @close="modalOpen = false"
      @confirm="deleteCategory"
    />
    <ConfirmModal
      v-model="folderDeleteModal" :title="$t('attention')" :btn-left="$t('button.cancel')"
      :btn-right="$t('button.delete')"
      :description="isCreator ? $t('modal.delete.description') : $t('modal.remove.description') "
      @close="folderDeleteModal = false" @confirm="deleteFolder"
    />
    <CreateFolderModal v-model="folderModal" :folder-id="folderToEdit" @on-create="onCreate" />
  </div>
</template>

<script setup lang="ts">
import type { CategoryFolder } from '~/assets/types/usersCategories'
import { useCategoryStore, useUserStore } from '#imports'

import { Dropdown } from 'floating-vue'
import { storeToRefs } from 'pinia'

import { onMounted, ref, watch } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'
import AppCategoryCard from '~/components/AppCategoryCard.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import CreateFolderModal from '~/components/modals/CreateFolderModal.vue'
import PageContainer from '~/components/PageContainer.vue'
import SkeletonLoader from '~/components/SkeletonLoader.vue'
import { AppButton, AppChip, AppDelayedElement, AppIcon } from '~/components/ui'
import { folderService } from '~/services/folderService'

import { useCategoriesStore } from '~/stores/categories'

const { categories, categoryFolders, activeFolder, loading } = storeToRefs(useCategoriesStore())
const { user } = storeToRefs(useUserStore())
const { getCategories, setActiveFolder, getFolders } = useCategoriesStore()
const { deleteCategory: deleteCategoryMethod, removeUserFromCategory } = useCategoryStore()

const modalOpen = ref<boolean>(false)
const folderModal = ref<boolean>(false)
const folderDeleteModal = ref(false)

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
async function deleteFolder() {
  await folderService.deleteFolder(activeFolder.value.toString())
  await getFolders()
  folderDeleteModal.value = false
  setActiveFolder(0)
}

function onCreate() {
  getFolders()
  getCategories()
}

const folderToEdit = ref()
function editFolder(folder: CategoryFolder) {
  if (folder.custom) {
    folderToEdit.value = folder.value as string
    folderModal.value = true
  }
}

onMounted(() => {
  getFolders()
})

watch(activeFolder, () => {
  setTimeout(() => {
    document.querySelector(`#folder-${activeFolder.value}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, 100)
  getCategories()
}, { immediate: true })
</script>

<style scoped>
  .embla {
    overflow: hidden;
  }
  .embla__container {
    display: flex;
  }
  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }
</style>
