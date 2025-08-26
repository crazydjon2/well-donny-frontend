<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { categoryService } from '~/services/categoryService'

import { useCategoryStore } from '~/stores/category'
import { useGlobalStore } from '~/stores/global'

const route = useRoute()
const categoryId: string = route.params?.id as string
const { setCategoryCards, setCategory } = useCategoryStore()

const [{ data: categoryData }, { data: categoryCards }] = await Promise.all([
  categoryService.getCategory(categoryId),
  categoryService.getCategoryCards(categoryId),
])

if (categoryData.value) {
  setCategory(categoryData.value)
}
if (categoryCards.value) {
  setCategoryCards(categoryCards.value)
}
</script>
