<template>
  <div class="container">
    <PageTop type="secondary" with-decoration class="mb-5 sticky top-5">
      <template #default>
        <span class="font-accent text-white text-meduim">{{ $t('new-course') }}</span>
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" class="cursor-pointer" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>
    <div class="flex flex-col gap-4">
      <AppInput v-model="category.name" :placeholder="$t('input.placeholder.course-title')" />
      <AppSelect v-model="category.type" :options="categoriesTypes" :placeholder="$t('input.placeholder.category')" />
      <AppInput v-model="category.description" :placeholder="$t('input.placeholder.description')" />
    </div>
    <div class="mt-8 flex flex-col gap-4 items-center w-full">
      <p class="text-small self-start">
        {{ $t('termins') }}
      </p>
      <div class="w-full flex flex-col gap-4">
        <TransitionGroup name="fade">
          <CreateWordCard
            v-for="(word, index) in words" :key="index" v-model:original="word.original"
            v-model:translated="word.translated"
          />
        </TransitionGroup>
      </div>
      <AppIcon icon="add" color="text-dark" @click="addWord" />
    </div>
    <AppDelayedElement @click="onCategoryCreate">
      <AppButton full outline class="mt-8">
        {{ $t('button.add-course') }}
      </AppButton>
    </AppDelayedElement>
  </div>
</template>

<script setup lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { CreateWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppButton, AppDelayedElement, AppIcon, AppInput, AppSelect } from '~/components/ui'
import { useRouterUtility } from '~/composables/useRouterUtility'
import { useCategoryStore } from '~/stores/category'

const { goBack } = useRouterUtility()
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
function addWord() {
  words.value.push({
    original: '',
    translated: '',
  })
}

async function onCategoryCreate() {
  if (category.type) {
    const { error } = await createCategory({
      ...category,
      type: category.type.id,
      words: words.value,
    })

    if (!error.value) {
      router.push('/')
    }
    else {
      console.error(error.value)
    }
  }
}
</script>
