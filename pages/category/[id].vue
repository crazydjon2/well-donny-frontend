<template>
  <NuxtPage />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryApi } from '~/api/category/getCategory'

import { getCategoryCardsApi } from '~/api/category/getCategoryCards'

import { useCategoryStore } from '~/stores/category'
import { useGlobalStore } from '~/stores/global'

const route = useRoute()
const categoryId: string = route.params?.id as string
const { setCategoryCards, setCategory } = useCategoryStore()
const { setLightHouseState } = useGlobalStore()

setLightHouseState(true)
const { data: categoryData } = await getCategoryApi(categoryId)
if (categoryData.value) {
  setCategory(categoryData.value)
}

onMounted(async () => {
  getCategoryCardsApi(categoryId)
    .then(({ data: cardsData }) => {
      if (cardsData.value) {
        setCategoryCards(cardsData.value)
      }
    })
    .finally(() => {
      setTimeout(() => {
        setLightHouseState(false)
      }, 1000)
    })
})

</script>
