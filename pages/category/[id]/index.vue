<template>
  <div>
    <AppPageHeader :title="category?.name">
      <template #default>
        <AppIcon icon="trash" :width="24" :height="24" color="text-white" class="absolute right-3" />
      </template>
    </AppPageHeader>
    <NuxtLink to="/">
      <p class="mt-[2px] text-extra-small text-primary text-center">
        @{{ category?.users[0].name }}
      </p>
    </NuxtLink>

    <div class="-mx-5 !mt-3">
      <Carousel v-bind="carouselConfig">
        <Slide v-for="card in cards" :key="card.id">
          <AppCard :text-first="card.word.original" :text-second="card.word.translated" />
        </Slide>
      </Carousel>
    </div>

    <div class="flex justify-between mt-5">
      <span class="text-regular">{{ cards?.length }} слов</span>
      <span class="text-regular">{{ category?.type.type }}</span>
    </div>

    <div class="grid grid-cols-2 gap-5">
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Carousel, Slide } from 'vue3-carousel'
import { useRoute } from 'vue-router'
import { AppIcon } from '~/components/ui'
import { useCategoryStore } from '~/stores/category'

const route = useRoute()
const { cards, category } = storeToRefs(useCategoryStore())

const carouselConfig = {
  itemsToShow: 2.5,
  wrapAround: true,
  height: 210,
  gap: 200,
}

const percent = 2
</script>
