<template>
  <div class="container !mb-[6rem]">
    <PageTop type="secondary" with-decoration class="mb-5 sticky top-5">
      <template #default>
        <span class="font-accent text-white text-meduim">редактирование курса</span>
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" class="cursor-pointer" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>
    <div class="flex flex-col gap-4">
      <AppInput v-model="categoryToEdit.name" :placeholder="$t('input.placeholder.course-title')" />
      <AppSelect
        v-model="categoryToEdit.type" :options="categoryTypes"
        :placeholder="$t('input.placeholder.category')"
      />
      <Transition name="move-down-small">
        <AppSelect
          v-if="subTypes.length" v-model="categoryToEdit.subType" :options="subTypes"
          :placeholder="$t('input.placeholder.category')"
        />
      </Transition>

      <AppInput v-model="categoryToEdit.description" :placeholder="$t('input.placeholder.description')" />
    </div>
    <div class="mt-8 flex flex-col gap-4 items-center w-full">
      <p class="text-h3 uppercase">
        {{ $t('termins') }}
      </p>
      <div class="w-full flex flex-col gap-4">
        <TransitionGroup name="fade">
          <template v-for="(word, index) in words" :key="index">
            <CreateWordCard
              v-if="!word.toDelete"
              v-model:original="word.original"
              v-model:translated="word.translated" @on-delete="onDelete(word, index)"
            />
          </template>
        </TransitionGroup>
      </div>
      <AppIcon icon="add" color="text-dark" @click="addWord" />
    </div>
    <AppDelayedElement :disabled="loader" @click="onCategoryCreate">
      <AppButton full outline class="mt-8" :disabled="loader">
        {{ $t('button.edit') }}
      </AppButton>
    </AppDelayedElement>
  </div>
</template>

<script setup lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { EditWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { useGlobalStore } from '#imports'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageTop from '~/components/PageTop.vue'
import { AppButton, AppDelayedElement, AppIcon, AppInput, AppSelect } from '~/components/ui'
import { useRouterUtility } from '~/composables/useRouterUtility'
import { categoryService } from '~/services/categoryService'
import { useCategoryStore } from '~/stores/category'

const { goBack } = useRouterUtility()
const { getCategoryTypes, editWord } = useCategoryStore()
const { loader } = storeToRefs(useGlobalStore())
const { setLoader } = useGlobalStore()
const { categoryTypes } = storeToRefs(useCategoryStore())
const router = useRouter()

const route = useRoute()
const categoryId: string = route.params?.id as string
const { getCategory, getCategoryCards } = useCategoryStore()
const { category, cards } = storeToRefs(useCategoryStore())
onMounted(async () => {
  await getCategoryTypes()
  getCategory(categoryId)
  getCategoryCards(categoryId)
})

const categoryToEdit: { name: string, id: string, description: string, type: CategoryType | null, subType: CategoryType | null } = reactive({
  id: '',
  name: '',
  description: '',
  type: null,
  subType: null,
})

const words = ref<EditWordDTO[]>([{ original: '', translated: '', id: '' }])
function addWord() {
  words.value.push({
    id: '',
    original: '',
    translated: '',
  })
}

async function onCategoryCreate() {
  if (categoryToEdit.type) {
    setLoader(true)
    const { error } = await editWord({
      ...categoryToEdit,
      type: categoryToEdit.subType?.id || categoryToEdit.type.id,
      words: words.value,
    })

    if (!error.value) {
      router.push('/')
    }
    else {
      console.error(error.value)
      setLoader(false)
    }
  }
}

const subTypes = ref<CategoryType[]>([])
watch(() => categoryToEdit.type, async () => {
  if (categoryToEdit.type) {
    const { data } = await categoryService.getCategoriesTypes(categoryToEdit.type.id)
    subTypes.value = data.value ? data.value : []
  }
})

watch(category, () => {
  if (category.value) {
    categoryToEdit.id = category.value.id
    categoryToEdit.name = category.value.name
    categoryToEdit.description = category.value.description

    if (category.value.type.parent) {
      categoryToEdit.type = category.value.type.parent
      categoryToEdit.subType = category.value.type
    }
    else {
      categoryToEdit.type = category.value.type
    }
  }
})

watch(cards, () => {
  if (cards.value) {
    words.value = cards.value.map((card) => {
      return {
        id: card.word.id,
        original: card.word.original,
        translated: card.word.translated,
      }
    })
  }
})

function onDelete(word: EditWordDTO, position: number) {
  if (word.id) {
    word.toDelete = true
  }
  else {
    words.value = words.value.filter((_, index) => index !== position)
  }
}
</script>
