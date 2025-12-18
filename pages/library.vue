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
      <!-- class="bg-white border-secondary-3 border-2 rounded-xl shadow-small-secondary-dark !shadow-secondary-4 w-full" -->
      <div class="w-full px-5 flex gap-4 translate-y-7">
        <AppInput
          v-model="name"
          secondary
          placeholder="Текст"
          class="w-full h-[2.5rem]"
        />
        <div
          class="bg-white flex items-center justify-center border-secondary-3 border-2 rounded-xl w-[2.6rem] shadow-small-secondary-dark !shadow-secondary-4"
        >
          <AppIcon icon="sort" :width="32" :height="16" />
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex gap-4 overflow-auto items-center w-full sticky bg-white top-0 left-0 z-60 py-2.5">
        <Transition name="move-down-small">
          <div v-if="activeSubType" class="relative flex overflow-hidden px-4">
            <AppIcon icon="chevron-left" :width="24" :height="24" class="left-1 -top-0.5" @click="getCategories(activeType)" />
            <p class="text-small font-bold ml-2" @click="getCategories(activeType)">
              {{ activeSubTypeName }}
            </p>
          </div>
          <div v-else class="flex h-full gap-4 overflow-auto items-center w-full px-4">
            <AppChip
              v-for="type in categoryTypes" :key="type.id" :active="activeType === type.id"
              @click="getCategories(type.id)"
            >
              <span class="text-small font-normal">{{ type.name }}</span>
            </AppChip>
          </div>
        </Transition>
      </div>
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
        <div v-else-if="categories.length" class="grid grid-cols-1 gap-6 px-5 pt-5 w-full">
          <MotionComponent
            v-for="(category, index) in categories" :key="index"
            :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
            :leave="{ opacity: 0, scale: 0.8 }" :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
          >
            <div v-if="!activeSubType" class="flex items-center py-2 border-b-[1px] mb-4">
              <p class="text-small uppercase">
                {{ category.type.name }}
              </p>
              <AppButton :type="ButtonTypes.SECONDARY" outline small class="flex items-center justify-center w-6 h-6 ml-auto" @click="activeSubTypeName = category.type.name;getCategories(category.type.id, true)">
                <AppIcon icon="chevron-left" :width="16" :height="16" class="rotate-180" />
              </AppButton>
            </div>
            <div class="flex w-full gap-4 overflow-x-auto p-1" :class="activeSubType && 'grid grid-cols-2'">
              <div v-for="(c, ind) in category.items" :key="c.category.id" class="flex-none w-[calc(50%-0.5rem)]" :class="activeSubType && 'w-full'">
                <NuxtLink :to="`/category/${c.category.id}`">
                  <AppCategoryCard :category="c.category" :author="c?.author" :rate="c.rate" :primary="activeSubType ? !(ind % 4 === 1 || ind % 4 === 2) : ind % 2 === 0" />
                </NuxtLink>
              </div>
            </div>
          </MotionComponent>
        </div>
        <div v-else class="w-full">
          <!-- <div class="w-full bg-grey rounded-3xl aspect-square max-w-[300px] mx-auto" /> -->
          <img src="/assets//img//donny-sad.jpg" alt="Sad Donny" class="max-h-[250px] mx-auto mt-6 animation-swim" />
          <h2 class="font-accent text-[6rem] w-full text-center">
            Здесь пусто
          </h2>
        </div>
      </Transition>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import type { UsersCategory } from '~/assets/types/usersCategories'
import { useCategoryStore } from '#imports'
import { MotionComponent } from '@vueuse/motion'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { ButtonTypes } from '~/assets/types/ui'
import AppCategoryCard from '~/components/AppCategoryCard.vue'
import PageContainer from '~/components/PageContainer.vue'
import { AppButton, AppChip, AppIcon, AppInput } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'

const { getCategoryTypes } = useCategoryStore()
const { categoryTypes } = storeToRefs(useCategoryStore())

const activeType = ref('')
const activeSubType = ref('')
const activeSubTypeName = ref('')

const name = ref('')

onMounted(async () => {
  await getCategoryTypes()
  if (categoryTypes.value && categoryTypes.value[0]) {
    activeType.value = categoryTypes && categoryTypes.value ? categoryTypes.value[0].id : ''
  }
  getCategories(activeType.value)
})

const categories = ref<{ type: { name: string, id: string, type: string }, items: (UsersCategory & { averageRate: number })[] }[]>([])
const loading = ref<boolean>(true)
async function getCategories(type?: string, isSubType: boolean = false) {
  if (type) {
    if (!isSubType) {
      activeType.value = type
      activeSubType.value = ''
    }
    else {
      activeSubType.value = type
    }
    loading.value = true
    const { data } = await categoriesService.getByType(isSubType ? activeSubType.value : activeType.value, name.value, 0, 5)
    if (data.value) {
      categories.value = data.value
    }
  }
  loading.value = false
}

let timer: number
watch(name, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    getCategories(activeSubType.value ? activeSubType.value : activeType.value, !!activeSubType.value)
  }, 300)
})
</script>
