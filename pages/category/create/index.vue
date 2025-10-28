<template>
  <div class="container !mb-[6rem]">
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
      <AppSelect v-model="category.type" :options="categoryTypes" :placeholder="$t('input.placeholder.category')" />
      <Transition name="move-down-small">
        <AppSelect v-if="subTypes.length" v-model="category.subType" :options="subTypes" :placeholder="$t('input.placeholder.category')" />
      </Transition>
      <AppInput v-model="category.description" :placeholder="$t('input.placeholder.description')" />
    </div>
    <div class="mt-8 flex flex-col gap-4 items-center w-full">
      <p class="text-h3 uppercase">
        {{ $t('termins') }}
      </p>
      <div class="w-full flex flex-col gap-4">
        <TransitionGroup name="fade">
          <CreateWordCard
            v-for="(word, index) in words" :key="index" v-model:original="word.original"
            v-model:translated="word.translated"
            @on-delete="deleteCard(index)"
          />
        </TransitionGroup>
      </div>
      <AppIcon icon="add" color="text-dark" @click="addWord" />
    </div>
    <AppDelayedElement :disabled="loader" @click="onCategoryCreate">
      <AppButton full outline class="mt-8" :disabled="loader">
        {{ $t('button.add-course') }}
      </AppButton>
    </AppDelayedElement>
  </div>
</template>

<script setup lang="ts">
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { CreateWordDTO } from '~/assets/types/word'
import { CreateWordCard } from '#components'
import { useGlobalStore } from '#imports'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageTop from '~/components/PageTop.vue'
import { AppButton, AppDelayedElement, AppIcon, AppInput, AppSelect } from '~/components/ui'
import { useRouterUtility } from '~/composables/useRouterUtility'
import { categoryService } from '~/services/categoryService'
import { useCategoryStore } from '~/stores/category'

const { goBack } = useRouterUtility()
const { getCategoryTypes, createCategory } = useCategoryStore()
const { loader } = storeToRefs(useGlobalStore())
const { setLoader } = useGlobalStore()
const { categoryTypes } = storeToRefs(useCategoryStore())
const router = useRouter()

onMounted(async () => {
  await getCategoryTypes()
})

const category: { name: string, description: string, type: CategoryType | null, subType: CategoryType | null } = reactive({
  name: '',
  description: '',
  type: null,
  subType: null,
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
    setLoader(true)
    const { error } = await createCategory({
      ...category,
      type: category.subType?.id || category.type.id,
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
