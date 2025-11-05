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
      <div class="flex h-full gap-4 overflow-auto items-center w-full">
        <AppChip
          v-for="type in categoryTypes" :key="type.id" :active="activeType === type.id"
          @click="getCategories(type.id)"
        >
          <span class="text-small font-normal">{{ $t(`category.type.${type.type}`) }}</span>
        </AppChip>
      </div>
    </template>
    <template #content>
      <div class="min-h-[100vh]">
        <Transition name="move-down-small">
          <div v-if="loading" class="grid grid-cols-1 gap-6 px-5 pt-5 w-full">
            <div v-for="j in 3" :key="j">
              <p class="text-small py-2 mb-4 uppercase">
                <SkeletonLoader height="41px" width="200px" />
              </p>
              <div class="flex w-full gap-4 overflow-x-auto p-2">
                <SkeletonLoader v-for="n in 2" :key="n" class="flex flex-col relative rounded-xl p-4 aspect-square" />
              </div>
            </div>
          </div>
          <div v-else-if="categories" class="grid grid-cols-1 gap-6 px-5 pt-5 w-full">
            <MotionComponent
              v-for="(categoryKey, index) in Object.keys(categories)" :key="index"
              :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
              :leave="{ opacity: 0, scale: 0.8 }" :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
            >
              <p class="text-small py-2 border-b-[1px] mb-4 uppercase">
                {{ categoryKey }}
              </p>
              <div class="flex w-full gap-4 overflow-x-auto p-2">
                <div v-for="category in categories[categoryKey]" :key="category.id" class="w-[calc(50%-10px)]">
                  <AppDelayedElement :to="`/category/${category.category.id}`">
                    <AppCategoryCard :category="category.category" :author="category.user" :rate="category.averageRate" />
                  </AppDelayedElement>
                </div>
              </div>
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
</template>

<script setup lang="ts">
import type { UsersCategory } from '~/assets/types/usersCategories'
import { useCategoryStore } from '#imports'
import { MotionComponent } from '@vueuse/motion'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import PageContainer from '~/components/PageContainer.vue'
import { AppChip, AppDelayedElement, AppIcon, AppInput } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'

const { getCategoryTypes } = useCategoryStore()
const { categoryTypes } = storeToRefs(useCategoryStore())

const activeType = ref('')

onMounted(async () => {
  await getCategoryTypes()
  if (categoryTypes.value && categoryTypes.value[0]) {
    activeType.value = categoryTypes && categoryTypes.value ? categoryTypes.value[0].id : ''
  }
  getCategories(activeType.value)
})

const categories = ref<Record<string, (UsersCategory & { averageRate: number })[]> | null>(null)
const loading = ref<boolean>(true)
async function getCategories(type: string) {
  if (type) {
    activeType.value = type
    loading.value = true
    const { data } = await categoriesService.getByType(activeType.value)
    if (data.value) {
      if (Object.keys(data.value).length !== 0) {
        categories.value = data.value
      }
      else {
        categories.value = null
      }
    }
  }
  loading.value = false
}
</script>
