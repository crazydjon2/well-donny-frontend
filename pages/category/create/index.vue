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
      <AppInput v-model="category.name" :placeholder="$t('input.placeholder.course-title')" :error="errors?.name && errors?.name[0]" />
      <AppSelect v-model="category.type" :options="categoryTypes" :placeholder="$t('input.placeholder.category')" :error="errors?.type && errors?.type[0]" />
      <Transition name="move-down-small">
        <AppSelect v-if="subTypes.length" v-model="category.subType" :options="subTypes" :placeholder="$t('input.placeholder.category')" :error="errors?.subType && errors?.subType[0]" />
      </Transition>
      <AppInput v-model="category.description" :placeholder="$t('input.placeholder.description')" :error="errors?.description" />
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
          <CreateWordCard
            v-for="(word, index) in words"
            :key="getWordKey(word, index)"
            v-model:original="word.original"
            v-model:translated="word.translated"
            :class="{ 'new-word': word.isNew }"
            :error="errors?.words && errors.words[index] ? errors?.words[index] : undefined "
            @on-delete="deleteCard(index)"
          />
        </TransitionGroup>
      </div>
    </div>
    <Teleport to="body">
      <Transition name="move-up">
        <AppDelayedElement v-if="!isMenuVisible" :disabled="loader" class="fixed bottom-4 left-0 px-5" @click="onCategoryCreate">
          <AppButton full outline :disabled="loader">
            {{ $t('button.add-course') }}
          </AppButton>
        </AppDelayedElement>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { CreateWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { useGlobalStore } from '#imports'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageTop from '~/components/PageTop.vue'
import { AppButton, AppDelayedElement, AppIcon, AppInput, AppSelect } from '~/components/ui'
import { useRouterUtility } from '~/composables/useRouterUtility'
import { categoryService } from '~/services/categoryService'
import { useCategoryStore } from '~/stores/category'

const { goBack } = useRouterUtility()
const { getCategoryTypes, createCategory } = useCategoryStore()
const { loader, isMenuVisible } = storeToRefs(useGlobalStore())
const { setLoader, setMenuVisibility } = useGlobalStore()
const { categoryTypes } = storeToRefs(useCategoryStore())
const router = useRouter()

onMounted(async () => {
  setMenuVisibility(false)
  await getCategoryTypes()
})

onUnmounted(() => {
  setMenuVisibility(true)
})

const category: { name: string, description: string, type: CategoryType | null, subType: CategoryType | null } = reactive({
  name: '',
  description: '',
  type: null,
  subType: null,
})

// Добавляем уникальные ID для каждого слова
const words = ref<Array<CreateWordDTO & { id: number, isNew: boolean }>>([
  { original: '', translated: '', id: Date.now(), isNew: false },
])

let nextWordId = Date.now() + 1

function addWord() {
  words.value.unshift({
    original: '',
    translated: '',
    id: nextWordId++,
    isNew: true,
  })

  // Убираем флаг isNew после анимации
  setTimeout(() => {
    const newWord = words.value.find(word => word.id === nextWordId - 1)
    if (newWord) {
      newWord.isNew = false
    }
  }, 500)
}

function getWordKey(word: any, index: number) {
  return word.id || index
}

const errors = ref<{ name?: string, description?: string, type?: string, subType?: string, words?: Record<number, Record<string, string[]>> } | null>(null)
async function onCategoryCreate() {
  errors.value = null
  setLoader(true)
  // Убираем служебные поля перед отправкой
  const wordsToSend = words.value.map(({ id, isNew, ...word }) => word)

  const { error } = await createCategory({
    name: category.name,
    description: category.description,
    type: category.subType?.id || category.type?.id || '',
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

const subTypes = ref<CategoryType[]>([])
watch(() => category.type, async () => {
  if (category.type) {
    const { data } = await categoryService.getCategoriesTypes(category.type.id)
    subTypes.value = data.value ? data.value : []
  }
})

function deleteCard(position: number) {
  words.value = words.value.filter((_, index) => index !== position)
}
</script>

<style scoped>
/* Анимация только для новых слов */
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

/* Анимация для удаления всех элементов */
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
