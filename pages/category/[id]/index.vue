<template>
  <div v-if="category" class="container">
    <PageTop type="primary" with-decoration>
      <template #left>
        <AppIcon icon="chevron-left" :width="22" :height="26" color="text-white" />
      </template>
      <template #default>
        <span class="font-accent text-white text-meduim">{{ category?.name }}</span>
      </template>
      <template #right>
        <AppIcon icon="tuning" :width="22" :height="26" color="text-white" />
      </template>
    </PageTop>
    <!-- <AppPageHeader :title="category?.name">
      <template #default>
        <AppIcon icon="trash" :width="24" :height="24" color="text-white" class="absolute right-3" />
      </template>
    </AppPageHeader> -->
    <NuxtLink to="/">
      <p v-if="category?.users" class="mt-[2px] text-extra-small text-primary text-center">
        @{{ category?.users[0].name }}
      </p>
    </NuxtLink>

    <div class="!mt-3 !-mx-5 max-w-[100vw]">
      <Carousel v-bind="carouselConfig">
        <Slide v-for="card in cards" :key="card.id">
          <AppCard :text-first="card.word.original" :text-second="card.word.translated" />
        </Slide>
      </Carousel>
    </div>

    <div v-if="category.type" class="flex justify-between mt-5">
      <span class="text-regular">{{ cards?.length }} слов</span>
      <span class="text-regular">{{ category?.type.type }}</span>
    </div>

    <div v-if="isUserInCategory" class="grid grid-cols-2 gap-5">
      <CategoryStatusCard :percent="percent" class="min-h-[125px] h-[calc(100%+4px)]" />
      <NuxtLink :to="`${route.fullPath}/cards`">
        <div
          class="flex items-center justify-center border-2 border-secondary rounded-xl min-h-[125px] h-full shadow-secondary"
        >
          <span class="text-regular font-bold uppercase">карточки</span>
        </div>
      </NuxtLink>
      <!-- <div
        class="flex items-center justify-center border-2 border-secondary rounded-xl min-h-[125px] shadow-secondary"
      >
        <span class="text-regular font-bold uppercase">повторение</span>
      </div> -->
      <NuxtLink :to="`${route.fullPath}/test`" class="col-span-2">
        <div
          class="flex items-center justify-center border-2 border-secondary  rounded-xl min-h-[125px] shadow-secondary"
        >
          <span class="text-regular font-bold uppercase">тест</span>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="flex flex-col mt-5">
      <div class="w-full text-center">
        ТУТ ТАКАЯ СТАТИСТКА ДА
      </div>
      <AppButton class="mt-5" :type="ButtonTypes.SECONDARY" outline @click="addUser">
        добавить курс
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import { useRoute } from 'vue-router'
import { ButtonTypes } from '~/assets/types/ui'
import PageTop from '~/components/PageTop.vue'
import { AppButton, AppIcon } from '~/components/ui'
import { categoryService } from '~/services/categoryService'
import { useCategoryStore } from '~/stores/category'

const route = useRoute()
const { category } = storeToRefs(useCategoryStore())
const { user } = storeToRefs(useUserStore())

const { cards } = useCategoryStore()

const isUserInCategory = computed(() => {
  if (user && user.value) {
    return category.value?.users.some(u => u.id === user.value?.id)
  }
  return false
})
function addUser() {
  if (user.value && category.value) {
    categoryService.addUserToCategory({ user: user.value, categoryId: category.value?.id })
      .then(() => {
        useCategoryStore().getCategory(route.params?.id as string)
      })
  }
}

const carouselConfig = {
  itemsToShow: 2.5,
  wrapAround: true,
  height: 210,
  gap: 200,
}

const percent = 2
</script>
