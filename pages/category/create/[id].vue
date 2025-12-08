<template>
  <div class="container pb-30">
    <PageTop type="secondary" with-decoration class="mb-5 sticky top-5">
      <template #default>
        <span class="font-accent text-white text-meduim">{{ $t('category.edit') }}</span>
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" class="cursor-pointer" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>
    <div class="flex flex-col gap-4">
      <AppInput v-model="categoryToEdit.name" :placeholder="$t('input.placeholder.course-title')" :error="errors?.name && errors?.name[0]" />
      <AppSelect
        v-model="categoryToEdit.type" :options="categoryTypes"
        :placeholder="$t('input.placeholder.category')"
        :error="errors?.type && errors?.type[0]"
      />
      <Transition name="move-down-small">
        <AppSelect
          v-if="subTypes.length" v-model="categoryToEdit.subType" :options="subTypes"
          :placeholder="$t('input.placeholder.category')"
          :error="errors?.subType && errors?.subType[0]"
        />
      </Transition>

      <AppInput v-model="categoryToEdit.description" :placeholder="$t('input.placeholder.description')" :error="errors?.description" />
    </div>
    <div class="mt-8 flex flex-col gap-4 items-center w-full">
      <p class="text-h3 uppercase">
        {{ $t('termins') }}
      </p>
      <div class="rounded-full bg-secondary shadow-small-secondary">
        <AppIcon icon="plus" color="text-white" @click="addWord" />
      </div>
      <div class="w-full flex flex-col gap-4">
        <TransitionGroup name="word-item">
          <template v-for="(word, index) in words" :key="getWordKey(word, index)">
            <CreateWordCard
              v-if="!word.toDelete"
              v-model:original="word.original"
              v-model:translated="word.translated"
              :class="{ 'new-word': word.isNew }"
              :error="errors?.words && errors.words[index] ? errors?.words[index] : undefined "
              @on-delete="onDelete(word, index)"
            />
          </template>
        </TransitionGroup>
      </div>
    </div>
    <Teleport to="body">
      <Transition name="move-up">
        <AppDelayedElement v-if="!isMenuVisible" :disabled="loader" class="fixed bottom-4 left-0 px-5" @click="onCategoryCreate">
          <AppButton full outline :disabled="loader">
            {{ $t('button.save') }}
          </AppButton>
        </AppDelayedElement>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { EditWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { useGlobalStore } from '#imports'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageTop from '~/components/PageTop.vue'
import { AppButton, AppDelayedElement, AppIcon, AppInput, AppSelect } from '~/components/ui'
import { useRouterUtility } from '~/composables/useRouterUtility'
import { categoryService } from '~/services/categoryService'
import { useCategoryStore } from '~/stores/category'

const { goBack } = useRouterUtility()
const { getCategoryTypes, editWord } = useCategoryStore()
const { loader, isMenuVisible } = storeToRefs(useGlobalStore())
const { setLoader, setMenuVisibility } = useGlobalStore()
const { categoryTypes } = storeToRefs(useCategoryStore())
const router = useRouter()

const route = useRoute()
const categoryId: string = route.params?.id as string
const { getCategory, getCategoryCards } = useCategoryStore()
const { category, cards } = storeToRefs(useCategoryStore())

// Добавляем счетчик для новых слов
let nextWordId = Date.now() + 1

onMounted(async () => {
  await getCategoryTypes()
  setMenuVisibility(false)
  getCategory(categoryId)
  getCategoryCards(categoryId)
})

onUnmounted(() => {
  setMenuVisibility(true)
})

const categoryToEdit: { name: string, id: string, description: string, type: CategoryType | null, subType: CategoryType | null } = reactive({
  id: '',
  name: '',
  description: '',
  type: null,
  subType: null,
})

const words = ref<Array<EditWordDTO & { tempId?: number, isNew?: boolean }>>([])

function addWord() {
  words.value.unshift({
    id: '',
    original: '',
    translated: '',
    tempId: nextWordId++,
    isNew: true,
  })

  setTimeout(() => {
    const newWord = words.value.find(word => word.tempId === nextWordId - 1)
    if (newWord) {
      newWord.isNew = false
    }
  }, 500)
}

function getWordKey(word: any, index: number) {
  return word.tempId || word.id || index
}

const errors = ref<{ name?: string, description?: string, type?: string, subType?: string, words?: Record<number, Record<string, string[]>> } | null>(null)
async function onCategoryCreate() {
  if (categoryToEdit.type) {
    setLoader(true)
    const wordsToSend = words.value.map(({ tempId, isNew, ...word }) => word)

    const { error } = await editWord({
      id: categoryId,
      name: categoryToEdit.name,
      description: categoryToEdit.description,
      type: categoryToEdit.subType?.id || categoryToEdit.type.id,
      words: wordsToSend,
    })

    if (!error.value) {
      router.push('/')
    }
    else {
      errors.value = error.value.data.errors
      setLoader(false)
    }
  }
}

const subTypes = ref<CategoryType[]>([])
watch(() => categoryToEdit.type, async (newValue, oldValue) => {
  if (categoryToEdit.type) {
    const { data } = await categoryService.getCategoriesTypes(categoryToEdit.type.id)
    subTypes.value = data.value ? data.value : []

    if (oldValue !== null)
      categoryToEdit.subType = null
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
        isNew: false,
      }
    })
  }
})

function onDelete(word: EditWordDTO & { tempId?: number, isNew?: boolean }, position: number) {
  if (word.id) {
    word.toDelete = true
  }
  else {
    words.value = words.value.filter((_, index) => index !== position)
  }
}
</script>

<style scoped>
.word-item-enter-active {
  transition: all 0.3s ease-out;
}

.word-item-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.word-item-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.word-item-leave-active {
  transition: all 0.3s ease-in;
  position: absolute;
  width: 100%;
}

.word-item-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.word-item-move {
  transition: transform 0.3s ease;
}
</style>
