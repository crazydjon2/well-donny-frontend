<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { categoryService } from '~/services/categoryService'

import { useCategoryStore } from '~/stores/category'

const route = useRoute()
const categoryId: string = route.params?.id as string
const { setCategoryCards, getCategory } = useCategoryStore()

const [_, { data: categoryCards }] = await Promise.all([
  getCategory(categoryId),
  categoryService.getCategoryCards(categoryId),
])

if (categoryCards.value) {
  setCategoryCards(categoryCards.value)
}
</script>
