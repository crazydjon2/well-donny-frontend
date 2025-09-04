<template>
  <PageContainer page="main">
    <template #title>
      <h2 class="p-5 font-accent text-link-active text-[6rem] leading-[90px]">
        МОИ КУРСЫ
      </h2>
    </template>
    <template #additional>
      <div class="flex w-full gap-7">
        <div class="w-full h-full bg-grey">
          ЭТО ДОННИ
        </div>
        <NuxtLink
          to="/category/create"
          class="flex flex-col w-full min-h-[6rem] items-center justify-center bg-white border-primary-2 border-2 rounded-xl shadow-primary-dark"
        >
          <span class="text-regular uppercase font-bold">Создать</span>
          <AppIcon icon="add" :width="30" :height="30" />
        </NuxtLink>
      </div>
    </template>
    <template #content>
      <div class="rounded-t-3xl h-[1000px]">
        <div class="flex gap-4 overflow-auto items-cente sticky top-0 bg-white z-50 px-5 pt-5 w-full">
          <AppChip
            v-for="chip in chips" :key="chip" :text="chip" :active="chip === activeChip"
            @click="activeChip = chip"
          />

          <AppIcon icon="plus" color="text-dark" :width="16" :height="16" />
        </div>

        <div v-if="categories.length" class="grid grid-cols-2 gap-6 px-5 pt-5">
          <div v-for="(category, index) in categories" :key="category.id">
            <NuxtLink :to="`/category/${category.category.id}`">
              <AppCategoryCard :category="category.category" :author="category.user" :primary="!(index % 4 === 1 || index % 4 === 2)">
                <template #default>
                  <div class="absolute right-4 bottom-5" @click.prevent="beforeDelete(category.category.id)">
                    <AppIcon icon="trash" :width="16" :height="16" />
                  </div>
                </template>
              </AppCategoryCard>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </PageContainer>
  <ConfirmModal
    v-model="modalOpen" title="Внимание!"
    description="Курс и весь его прогресс будет полностью удален (и у других пользователей тоже!)" btn-left="отмена"
    btn-right="удалить" @close="modalOpen = false" @confirm="deleteCategory"
  />
</template>

<script setup lang="ts">
import { useCategoryStore } from '#imports'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import AppCategoryCard from '~/components/AppCategoryCard.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import PageContainer from '~/components/PageContainer.vue'
import { AppChip, AppIcon } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'

import { useCategoriesStore } from '~/stores/categories'

const { categories } = storeToRefs(useCategoriesStore())
const { setCategories } = useCategoriesStore()
const { data } = await categoriesService.getCategories()
const { deleteCategory: deleteCategoryMethod } = useCategoryStore()

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
function beforeDelete(id: string) {
  categoryId.value = id
  modalOpen.value = true
}
function deleteCategory() {
  deleteCategoryMethod(categoryId.value)
    .then(() => {
      modalOpen.value = false
    })
}
</script>
