<template>
  <div>
    <div class="flex flex-col gap-4">
      <AppInput v-model="category.name" placeholder="Название курса" />
      <AppSelect v-model="category.type" :options="categoriesTypes" placeholder="Категория" />
      <AppInput v-model="category.description" placeholder="Описание" />
    </div>
    <div class="mt-8 flex flex-col gap-4 items-center w-full">
      <p class="text-small self-start">Термины</p>
      <div class="w-full flex flex-col gap-4">
      <CreateWordCard v-for="(word, index) in words" :key="index" :word="word"></CreateWordCard>
      </div>
      <AppIcon icon="add" color="text-dark" @click="addWord"/>
    </div>
  </div>
</template>

<script lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import { useCategoriesStore } from '#imports'
import { defineComponent, reactive, ref } from 'vue'
import { AppInput, AppSelect, AppIcon } from '~/components/ui'
import { CreateWordCard } from '#components'

export default defineComponent({
  components: {
    AppInput,
    AppSelect,
    CreateWordCard,
    AppIcon,
  },
  async setup() {
    const { getCategoriesTypes } = useCategoriesStore()
    const { categoriesTypes } = useCategoriesStore()
    await getCategoriesTypes()
    const category: { name: string, description: string, category: string, type: CategoryType | null } = reactive({
      name: '',
      description: '',
      category: '',
      type: null,
    })

    const words = ref<{ original: string, translated: string }[]>([{ original: '', translated: '' }])
    const addWord = () => {
      words.value.push({
        original: '',
        translated: ''
      })
    }

    return { category, categoriesTypes, words, addWord }
  },
})
</script>
