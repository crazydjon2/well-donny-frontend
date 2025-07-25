<template>
  <div>
    <div class="flex flex-col gap-4">
      <AppInput v-model="category.name" placeholder="Название курса" />
      <AppSelect v-model="category.type" :options="categoriesTypes" placeholder="Категория" />
      <AppInput v-model="category.description" placeholder="Описание" />
    </div>
    <div class="mt-8 flex flex-col gap-4 items-center w-full">
      <p class="text-small self-start">
        Термины
      </p>
      <div class="w-full flex flex-col gap-4">
        <TransitionGroup name="fade">
          <CreateWordCard v-for="(word, index) in words" :key="index" v-model:original="word.original" v-model:translated="word.translated" />
        </TransitionGroup>
      </div>
      <AppIcon icon="add" color="text-dark" @click="addWord" />
    </div>
    <AppButton @click="onCategoryCreate">
      AAAAAAAAAAAAAAAAA
    </AppButton>
  </div>
</template>

<script lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { CreateWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { defineComponent, reactive, ref } from 'vue'
import { AppButton, AppIcon, AppInput, AppSelect } from '~/components/ui'
import { useCategoriesStore } from '~/stores/categories'
import { useCategoryStore } from '~/stores/category'

export default defineComponent({
  components: {
    AppInput,
    AppSelect,
    CreateWordCard,
    AppIcon,
    AppButton,
  },
  async setup() {
    const { getCategoriesTypes, createCategory } = useCategoryStore()
    const { categoriesTypes } = useCategoriesStore()
    await getCategoriesTypes()
    const category: { name: string, description: string, type: CategoryType | null } = reactive({
      name: '',
      description: '',
      type: null,
    })

    const words = ref<CreateWordDTO[]>([{ original: '', translated: '' }])
    const addWord = () => {
      words.value.push({
        original: '',
        translated: '',
      })
    }

    const onCategoryCreate = () => {
      if (category.type) {
        createCategory({
          ...category,
          type: category.type.id,
          words: words.value,
        })
      }
    }

    return { category, categoriesTypes, words, addWord, onCategoryCreate }
  },
})
</script>
