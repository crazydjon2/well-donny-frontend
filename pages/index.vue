<template>
  <div class="text-primary text-2xl">
    <div v-for="(category) in categories" :key="category.id">
      <NuxtLink :to="`/category/${category.id}`">
        {{ category.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
// import { useCustomFetch } from '#imports';
import { storeToRefs, useCategoriesStore } from '#imports'
import { getCategories } from '~/api/categories/getCategories'

export default {
  async setup() {
    const { categories } = storeToRefs(useCategoriesStore())
    const { setCategories } = useCategoriesStore()
    const { data } = await getCategories()

    if (data.value && !categories.value.length) {
      console.log(data.value)
      // categories.value = data.value
      setCategories(data.value)
    }

    return { categories }
  },
}
</script>
