<template>
  <div>
    <div>{{ category }}</div>
    <div>{{ $t('text') }}</div>
  </div>
</template>

<script lang="ts">
import { useCategoryStore } from '#imports';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { getCategoryById } from '~/api/categories/getCategory';

export default {
  async setup() {
    const route = useRoute()
    const categoryId: string = route.params?.id as string

    const { category } = storeToRefs(useCategoryStore())
    const { setCategory } = useCategoryStore()

    const { data } = await getCategoryById(categoryId)

    if (data.value && !category.value) {
      setCategory(data.value)
    }

    return { category }
  }
}
</script>