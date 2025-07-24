<template>
  <div>
    {{ category }}
    <div>{{ cards }}</div>
    <div>{{ $t('text') }}</div>
  </div>
</template>

<script lang="ts">
import { useCategoryStore } from '#imports'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { getCategoryApi } from '~/api/category/getCategory'
import { getCategoryCardsApi } from '~/api/category/getCategoryCards'

export default {
  async setup() {
    const route = useRoute()
    const categoryId: string = route.params?.id as string

    const { cards, category } = storeToRefs(useCategoryStore())
    const { setCategoryCards, setCategory } = useCategoryStore()

    const [categoryResponse, categoryCardsResponse] = await Promise.all([
      getCategoryApi(categoryId),
      getCategoryCardsApi(categoryId),
    ])
    if (categoryResponse) {
      setCategory(categoryResponse)
    }
    if (categoryCardsResponse) {
      setCategoryCards(categoryCardsResponse)
    }

    return { cards, category }
  },
}
</script>
