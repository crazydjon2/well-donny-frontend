<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" async setup>
import { onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { categoryService } from '~/services/categoryService'

import { useCategoryStore } from '~/stores/category'

const route = useRoute()
const categoryId: string = route.params?.id as string
const { getCategory, setUserCategory } = useCategoryStore()

const [_, { data: uc }] = await Promise.all([
  getCategory(categoryId),
  categoryService.getUserCategory(route.params.id as string),
])
if (uc.value) {
  setUserCategory(uc.value)
}

onBeforeUnmount(() => {
  setUserCategory(null)
})
</script>
