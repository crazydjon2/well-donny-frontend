<template>
  <div v-if="category" class="container !pb-[200px]">
    <PageTop type="primary" with-decoration>
      <template #left>
        <AppIcon
          icon="chevron-left" :width="22" :height="26" color="text-white" class="cursor-pointer"
          @click="goBack"
        />
      </template>
      <template #default>
        <span class="font-accent text-white text-meduim">{{ category?.name }}</span>
      </template>
      <template #right>
        <VDropdown :disabled="modal" placement="bottom-end">
          <AppIcon icon="tuning" :width="22" :height="26" color="text-white cursor-pointer" />
          <template #popper>
            <div class="p-5 gap-3 flex flex-col rounded-xl">
              <p class="text-small text-center border-b-1">
                {{ $t('action.edit') }}
              </p>
              <p class="text-small text-center border-b-1" @click="modalState = 'restart'; modal = true">
                {{
                  $t('action.restart') }}
              </p>
              <p class="text-small text-center border-b-1">
                {{ $t('action.share') }}
              </p>
              <p class="text-small text-center border-b-1" @click="modalState = 'delete'; modal = true">
                {{
                  $t('action.delete') }}
              </p>
            </div>
          </template>
        </VDropdown>
      </template>
    </PageTop>

    <div class="w-fit">
      <NuxtLink :to="`/profile/${category.users[0].id}`">
        <p v-if="category?.users" class="mt-[2px] text-extra-small text-primary w-fit">
          @{{ category?.users[0].name }}
        </p>
      </NuxtLink>
    </div>

    <div v-if="category.description" class="flex mt-2">
      <div class="rounded-full max-w-[2.75rem] max-h-[2.75rem] min-w-[2.75rem] min-h-[2.75rem] bg-grey" />
      <div class="w-full ml-6 bg-primary text-regular p-2 text-white rounded-xl relative">
        {{ category.description }}
        <div
          class="absolute left-[-19px] top-4 -translate-y-1/2
               w-0 h-0
               border-y-[6px] border-y-transparent
               border-r-[22px] border-primary -rotate-[15deg]"
        />
      </div>
    </div>

    <div class="!mt-3 !-mx-5 max-w-[100vw]">
      <Carousel v-bind="carouselConfig">
        <Slide v-for="card in cards" :key="card.id">
          <AppCard :text-first="card.word.original" :text-second="card.word.translated" />
        </Slide>
      </Carousel>
    </div>

    <div v-if="category.type" class="flex justify-between mt-5">
      <span class="text-regular">{{ cards?.length }} {{ $t('words') }}</span>
      <span class="text-regular">{{ $t(`category.type.${category?.type.type}`) }}</span>
    </div>

    <div v-if="isUserInCategory" class="grid grid-cols-2 gap-5">
      <CategoryStatusCard :percent="+percent" class="min-h-[125px] h-[calc(100%+4px)]" />
      <AppDelayedElement :to="`${route.fullPath}/cards`" class="border-secondary shadow-secondary border-2 rounded-xl">
        <div class="flex items-center justify-center rounded-xl min-h-[125px] h-full">
          <span class="text-regular font-bold uppercase">{{ $t('cards') }}</span>
        </div>
      </AppDelayedElement>
      <AppDelayedElement
        :to="`${route.fullPath}/test`"
        :disabled="+percent === 100"
        class="col-span-2 border-secondary shadow-secondary border-2 rounded-xl"
      >
        <div class="flex items-center justify-center rounded-xl min-h-[125px]">
          <span class="text-regular font-bold uppercase">{{ $t('test') }}</span>
        </div>
      </AppDelayedElement>
    </div>

    <div v-else class="flex flex-col mt-5">
      <div class="w-full text-center">
        ТУТ ТАКАЯ СТАТИСТКА ДА
      </div>
      <AppButton class="mt-5" :type="ButtonTypes.SECONDARY" outline @click="addUser">
        {{ $t('button.add-course') }}
      </AppButton>
    </div>

    <ConfirmModal
      v-model="modal" :title="$t('attention')" :description="modelDescription"
      :btn-left="$t('button.cancel')" :btn-right="$t('button.delete')" @close="modal = false" @confirm="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouterUtility, useUserStore } from '#imports'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ButtonTypes } from '~/assets/types/ui'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import PageTop from '~/components/PageTop.vue'
import { AppButton, AppDelayedElement, AppIcon } from '~/components/ui'
import { categoryService } from '~/services/categoryService'
import { testService } from '~/services/testService'
import { useCategoryStore } from '~/stores/category'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { goBack } = useRouterUtility()

const { category } = storeToRefs(useCategoryStore())
const { user } = storeToRefs(useUserStore())

const { cards } = useCategoryStore()

const isUserInCategory = computed(() => {
  if (user && user.value) {
    return category.value?.users.some(u => u.id === user.value?.id)
  }
  return false
})

function addUser() {
  if (user.value && category.value) {
    categoryService.addUserToCategory({ user: user.value, categoryId: category.value?.id })
      .then(() => {
        useCategoryStore().getCategory(route.params?.id as string)
      })
  }
}

const carouselConfig = {
  itemsToShow: 2.5,
  wrapAround: true,
  height: 210,
  gap: 200,
}

const percent = ref(0)
const { data } = await testService.getProgress(route.params.id as string)
if (data.value) {
  percent.value = data.value
}

const modalState = ref<'edit' | 'delete' | 'restart'>('edit')
const modal = ref(false)
const modelDescription = computed(() => {
  if (modalState.value === 'restart') {
    return t('modal.description.restart')
  }
  return t('modal.description.delete')
})

const isCreator = ref(category.value?.users.some(u => u.id === user.value?.id && u.role === 'creator'))
async function onConfirm() {
  if (category.value && user.value) {
    if (modalState.value === 'delete') {
      if (!isCreator.value) {
        await categoryService.removeUserFromCategory(user.value?.id, category.value?.id)
      }
      else {
        await categoryService.deleteCategory(category.value?.id)
      }
    }
    else {
      await testService.restartCourse(category.value?.id)
    }
    router.go(0)
  }
}
</script>
