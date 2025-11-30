<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { categoryService } from '~/services/categoryService'

import { useCategoryStore } from '~/stores/category'

const route = useRoute()
const categoryId: string = route.params?.id as string
const { getCategory, setUserCategory } = useCategoryStore()

onMounted(async () => {
  getCategory(categoryId)
  const { data: uc } = await categoryService.getUserCategory(route.params.id as string)
  if (uc.value) {
    setUserCategory(uc.value)
  }
})
</script>
