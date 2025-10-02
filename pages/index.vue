<template>
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
      <div class="flex h-full gap-4 overflow-auto items-center px-5 w-full">
        <AppChip
          v-for="chip in chips" :key="chip" :active="chip === activeChip"
          @click="activeChip = chip"
        >
          <p class="font-normal text-small">
            {{ chip }}
          </p>
        </AppChip>

        <AppIcon icon="plus" color="text-dark" class="mb-0.5" :width="16" :height="16" />
      </div>
    </template>
    <template #content>
      <div class="rounded-t-3xl pb-[200px]">
        <div v-if="categories.length" class="grid grid-cols-2 gap-6 px-5 pt-5">
          <div v-for="(category, index) in categories" :key="category.id">
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
          </div>
        </div>
      </div>
    </template>
  </PageContainer>
  <ConfirmModal
    v-model="modalOpen" :title="$t('attention')"
    :description="isCreator ? $t('delete-description') : $t('remove-description')" :btn-left="$t('button.cancel')"
    :btn-right="isCreator ? $t('button.delete') : $t('button.remove')" @close="modalOpen = false" @confirm="deleteCategory"
  />
</template>

<script setup lang="ts">
import { useCategoryStore, useUserStore } from '#imports'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import AppCategoryCard from '~/components/AppCategoryCard.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import PageContainer from '~/components/PageContainer.vue'
import { AppChip, AppDelayedElement, AppIcon } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'

import { useCategoriesStore } from '~/stores/categories'

const { categories } = storeToRefs(useCategoriesStore())
const { user } = storeToRefs(useUserStore())
const { setCategories } = useCategoriesStore()
const { data } = await categoriesService.getCategories()
const { deleteCategory: deleteCategoryMethod, removeUserFromCategory } = useCategoryStore()

const modalOpen = ref<boolean>(false)

const chips = ['все курсы', 'собственные', 'недавние']
const activeChip = ref('собственные')

if (data.value) {
  // categories.value = data.value
  setCategories(data.value)
}
else {
  setCategories([])
}

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
      })
  }
  else {
    if (user.value) {
      removeUserFromCategory(user.value?.id, categoryId.value)
        .then(() => {
          modalOpen.value = false
        })
    }
  }
}
</script>
