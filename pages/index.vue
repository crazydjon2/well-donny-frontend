<template>
  <div>
    <div class="bg-secondary py-1.5 px-10 relative flex items-center justify-center rounded-3xl">
      <span class="text-small text-white">Мои курсы</span>
      <AppIcon icon="plus" :width="24" :height="24" color="text-white" class="absolute right-3" />
    </div>

    <div class="flex my-5 gap-4 overflow-auto items-center">
      <AppChip v-for="chip in chips" :key="chip" :text="chip" :active="chip === activeChip" @click="activeChip = chip" />

      <AppIcon icon="plus" color="text-dark" :width="16" :height="16" />
    </div>

    <div class="text-primary text-2xl">
      <div v-for="(category) in categories" :key="category.id">
        <NuxtLink :to="`/category/${category.id}`">
          {{ category.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, storeToRefs, useCategoriesStore } from '#imports'
import { getCategories } from '~/api/categories/getCategories'
import { AppChip, AppIcon } from '~/components/ui'

export default {
  components: { AppIcon, AppChip },
  async setup() {
    const { categories } = storeToRefs(useCategoriesStore())
    const { setCategories } = useCategoriesStore()
    const { data } = await getCategories()

    const chips = ['все курсы', 'собственные', 'недавние']
    const activeChip = ref('собственные')

    if (data.value && !categories.value.length) {
      // categories.value = data.value
      setCategories(data.value)
    }

    return { categories, chips, activeChip }
  },
}
</script>
