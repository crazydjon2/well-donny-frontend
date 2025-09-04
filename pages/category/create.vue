<template>
  <div class="container">
    <PageTop type="secondary" with-decoration class="mb-5 sticky top-5">
      <template #default>
        <span class="font-accent text-white text-meduim">новый курс</span>
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" :width="16" :height="16" />
      </template>
    </PageTop>
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
    <AppButton full outline class="mt-8" @click="onCategoryCreate">
      добавить курс
    </AppButton>
  </div>
</template>

<script lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { CreateWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { storeToRefs } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppButton, AppIcon, AppInput, AppSelect } from '~/components/ui'
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
    const { categoriesTypes } = storeToRefs(useCategoryStore())
    const router = useRouter()

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
        }).then(() => {
          router.push('/')
        })
      }
    }

    return { category, categoriesTypes, words, addWord, onCategoryCreate }
  },
})
</script>
