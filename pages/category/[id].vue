<template>
  <div>
    {{ category }}
    <div>{{ cards }}</div>
    <div>{{ $t('text') }}</div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { getCategoryApi } from '~/api/category/getCategory'
import { getCategoryCardsApi } from '~/api/category/getCategoryCards'
import { useCategoryStore } from '~/stores/category'

export default {
  async setup() {
    const route = useRoute()
    const categoryId: string = route.params?.id as string

    const { cards, category } = storeToRefs(useCategoryStore())
    const { setCategoryCards, setCategory } = useCategoryStore()

    const [{ data: categoryData }, { data: cardsData }] = await Promise.all([
      getCategoryApi(categoryId),
      getCategoryCardsApi(categoryId),
    ])
    if (categoryData.value) {
      setCategory(categoryData.value)
    }
    if (cardsData.value) {
      setCategoryCards(cardsData.value)
    }

    return { cards, category }
  },
}
</script>
