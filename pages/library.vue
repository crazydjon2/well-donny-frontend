<template>
  <PageContainer page="library">
    <template #title>
      <div class="z-10">
        <h2 class="p-5 font-accent text-secondary-dark text-[6rem] leading-[90px]">
          {{ $t('library') }}
        </h2>
      </div>
    </template>
    <template #additional>
      <div class="w-full px-5 flex gap-4">
        <AppInput
          class="bg-white border-secondary-3 border-2 rounded-xl shadow-small-secondary-dark !shadow-secondary-4 w-full"
        />
        <div
          class="bg-white flex items-center justify-center border-secondary-3 border-2 rounded-xl shadow-small-secondary-dark !shadow-secondary-4"
        >
          <AppIcon icon="sort" :width="32" :height="16" />
        </div>
      </div>
    </template>
    <template #content-header>
      <div class="flex h-full gap-4 overflow-auto items-center px-5 w-full">
        <AppChip
          v-for="type in types" :key="type.id" :active="activeType === type.id"
          @click="getCategories(type.id)"
        >
          <span class="text-small font-normal">{{ $t(`category.type.${type.type}`) }}</span>
        </AppChip>
      </div>
    </template>
    <template #content>
      <div class="min-h-[400vh]">
        <div v-if="categories && categories.length" class="grid grid-cols-2 gap-6 px-5 pt-5">
          <div v-for="(category) in categories" :key="category.id">
            <AppDelayedElement :to="`/category/${category.category.id}`">
              <AppCategoryCard :category="category.category" :author="category.user">
                <!-- <template #default>
              <div class="absolute right-4 bottom-5" @click.prevent="beforeDelete(category.category.id)">
                <AppIcon icon="trash" :width="16" :height="16" />
              </div>
            </template> -->
              </AppCategoryCard>
            </AppDelayedElement>
          </div>
        </div>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import PageContainer from '~/components/PageContainer.vue'
import { AppChip, AppIcon, AppInput, AppDelayedElement } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'
import { categoryService } from '~/services/categoryService'
import { useCategoriesStore } from '~/stores/categories'

const { categories } = storeToRefs(useCategoriesStore())
const { setCategories } = useCategoriesStore()

const { data: types } = await categoryService.getCategoriesTypes()
const activeType = ref(types.value ? types.value[0].id : '')
getCategories(activeType.value)

async function getCategories(type: string) {
  activeType.value = type
  const { data } = await categoriesService.getAllCategories({ type: activeType.value })
  if (data.value) {
    setCategories(data.value)
  }
}
</script>
