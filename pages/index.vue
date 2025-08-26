<template>
  <div>
    <AppPageHeader title="Мои курсы">
      <template #default>
        <AppIcon icon="plus" :width="24" :height="24" color="text-white" class="absolute right-3" />
      </template>
    </AppPageHeader>

    <div class="flex my-5 gap-4 overflow-auto items-center">
      <AppChip
        v-for="chip in chips" :key="chip" :text="chip" :active="chip === activeChip"
        @click="activeChip = chip"
      />

      <AppIcon icon="plus" color="text-dark" :width="16" :height="16" />
    </div>

    <div v-if="categories.length" class="grid grid-cols-2 gap-6">
      <div v-for="(category) in categories" :key="category.id">
        <NuxtLink :to="`/category/${category.category.id}`">
          <AppCategoryCard :category="category.category" :author="category.user">
            <template #default>
              <div class="absolute right-4 bottom-5" @click.prevent="beforeDelete(category.category.id)">
                <AppIcon icon="trash" :width="16" :height="16" />
              </div>
            </template>
          </AppCategoryCard>
        </NuxtLink>
      </div>

      <ConfirmModal
        v-model="modalOpen" title="Внимание!"
        description="Курс и весь его прогресс будет полностью удален (и у других пользователей тоже!)"
        btn-left="отмена" btn-right="удалить" @close="modalOpen = false" @confirm="deleteCategory"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useCategoryStore } from '#imports'
import { storeToRefs } from 'pinia'
import { defineComponent, ref } from 'vue'

import AppCategoryCard from '~/components/AppCategoryCard.vue'
import AppPageHeader from '~/components/AppPageHeader.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import { AppChip, AppIcon } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'

import { useCategoriesStore } from '~/stores/categories'

export default defineComponent({
  components: { AppIcon, AppChip, AppCategoryCard, ConfirmModal, AppPageHeader },
  async setup() {
    const { categories } = storeToRefs(useCategoriesStore())
    const { setCategories } = useCategoriesStore()
    const { data } = await categoriesService.getCategories()
    const { deleteCategory: deleteCategoryMethod } = useCategoryStore()

    const modalOpen = ref<boolean>(false)

    const chips = ['все курсы', 'собственные', 'недавние']
    const activeChip = ref('собственные')

    if (data.value && !categories.value.length) {
      // categories.value = data.value
      setCategories(data.value)
    }

    const categoryId = ref<string>('')
    const beforeDelete = (id: string) => {
      categoryId.value = id
      modalOpen.value = true
    }
    const deleteCategory = () => {
      deleteCategoryMethod(categoryId.value)
        .then(() => {
          modalOpen.value = false
        })
    }

    return { categories, chips, activeChip, modalOpen, categoryId, deleteCategory, beforeDelete }
  },
})
</script>
