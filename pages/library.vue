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
        <AppChip v-for="type in categoryTypes" :key="type.id" :active="activeType === type.id" @click="getCategories(type.id)">
          <span class="text-small font-normal">{{ $t(`category.type.${type.type}`) }}</span>
        </AppChip>
      </div>
    </template>
    <template #content>
      <div class="min-h-[100vh]">
        <Transition name="move-down-small">
          <div v-if="categories && categories.length" class="grid grid-cols-2 gap-6 px-5 pt-5 w-full">
            <!-- TODO
          ADD ANIMATION -->
            <MotionComponent
              v-for="(category) in categories" :key="category.id" :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{ opacity: 1, scale: 1 }"
              :leave="{ opacity: 0, scale: 0.8 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
            >
              <AppDelayedElement :to="`/category/${category.category.id}`">
                <AppCategoryCard :category="category.category" :author="category.user" />
              </AppDelayedElement>
            </MotionComponent>
          </div>
          <div v-else class="grid grid-cols-2 gap-6 px-5 pt-5 w-full">
            <SkeletonLoader v-for="n in 4" :key="n" class="flex flex-col relative rounded-xl p-4 aspect-square" />
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
  if (categoryTypes.value) {
    activeType.value = categoryTypes.value ? categoryTypes.value[0].id : ''
  }
  getCategories(activeType.value)
})

const categories = ref<UsersCategory[]>([])
const loading = ref<boolean>(false)
async function getCategories(type: string) {
  activeType.value = type
  loading.value = true
  const { data } = await categoriesService.getAllCategories({ type: activeType.value, role: 'creator' })
  if (data.value) {
    categories.value = data.value
  }
  loading.value = false
}
</script>
