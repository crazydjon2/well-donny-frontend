import type { CategoryFolder, UsersCategory } from '~/assets/types/usersCategories'
import { useUserStore } from '#imports'
import { computed } from '@vue/reactivity'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoriesService } from '~/services/categoriesService'
import { folderService } from '~/services/folderService'
import { useGlobalStore } from './global'

export const useCategoriesStore = defineStore('categories', () => {
  const { t } = useI18n()
  const { setLoader } = useGlobalStore()
  const { user } = storeToRefs(useUserStore())

  const categories = ref<UsersCategory[]>([])
  const loading = ref<boolean>(false)

  const baseFolders: CategoryFolder[] = [
    {
      custom: false,
      name: t('folders.all'),
      value: 0,
    },
    {
      custom: false,
      name: t('folders.personal'),
      value: 1,
    },
    {
      custom: false,
      name: t('folders.recent'),
      value: 2,
    },
  ]
  const categoryFolders = ref<CategoryFolder[]>(baseFolders)
  const activeFolder = ref<string | number>(0)
  const activeFolderData = computed(() => {
    return categoryFolders.value.find(c => c.value === activeFolder.value)
  })

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategories = (data: UsersCategory[]) => {
    categories.value = data
  }

  const setActiveFolder = (value: number | string) => {
    activeFolder.value = value
  }

  const getCategoryByFolder = async (folder: CategoryFolder) => {
    if (!folder.custom) {
      const { data } = await categoriesService.getAllCategories({
        userId: user.value?.id,
        role: folder.value === 1 ? 'creator' : undefined,
        sort: folder.value === 2 ? 'DESC' : undefined,
      })
      return data.value || []
    }
    else {
      const { data } = await categoriesService.getAllCategories({
        userId: user.value?.id,
        folder: folder.value,
      })
      return data.value || []
    }
  }

  const getCategories = async () => {
    if (activeFolderData.value) {
      loading.value = true
      const categories: UsersCategory[] = await getCategoryByFolder(activeFolderData.value)
      setCategories(categories)
      loading.value = false
      setLoader(false)
    }
  }

  const getFolders = async () => {
    const { data } = await folderService.getFolders()
    categoryFolders.value = baseFolders.concat(data.value.map((folder) => {
      return {
        custom: true,
        value: folder.id,
        name: folder.name,
      }
    }))
  }

  return { categories, setCategories, getCategories, loading, categoryFolders, baseFolders, setActiveFolder, activeFolder, getCategoryByFolder, getFolders }
})
