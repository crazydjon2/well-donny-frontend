<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useCategoryStore } from '~/stores/category'

const route = useRoute()
const categoryId: string = route.params?.id as string
const { getCategory } = useCategoryStore()

onMounted(async () => {
  getCategory(categoryId)
})
</script>
