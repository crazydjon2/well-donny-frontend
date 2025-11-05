<template>
  <div v-if="category" class="container">
    <PageTop type="primary" with-decoration class="!z-30">
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
              <p v-if="isCreator" class="text-small text-center border-b-1" @click="goToEdit">
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

    <div class="flex">
      <NuxtLink :to="`/profile/${category.users[0].id}`" class="w-fit">
        <p v-if="category?.users" class="mt-[2px] text-extra-small text-primary w-fit">
          @{{ category?.users[0].name }}
        </p>
      </NuxtLink>

      <div
        v-if="myRate" class="ml-auto text-extra-small text-primary w-fit flex"
        @click="isRateModalEdit = true; rate = myRate; rateModal = true"
      >
        твоя оценка: {{ myRate }}
        <AppIcon icon="star-filled" :width="16" :height="16" color="text-secondary-2" class="ml-[1px]" />
      </div>
    </div>

    <div v-if="category.description" class="flex mt-2">
      <div class="rounded-full max-w-[2.75rem] max-h-[2.75rem] min-w-[2.75rem] min-h-[2.75rem] bg-grey" />
      <div class="w-full ml-6 bg-primary text-regular p-2 text-white rounded-xl relative">
        <p ref="description" :class="isExpanded ? '' : 'truncate-text'" class="break-all">
          {{ category.description }}
        </p>
        <div
          v-if="isDescriptionOverflow" class="rounded-full bg-secondary shadow-small-secondary w-fit ml-auto p-1"
          @click="isExpanded = !isExpanded"
        >
          <AppIcon
            icon="chevron-left" :width="16" :height="16" class="w-fit ml-auto -rotate-90"
            :class="isExpanded && 'rotate-90'"
          />
        </div>
        <div
          class="absolute left-[-19px] top-4 -translate-y-1/2
               w-0 h-0
               border-y-[6px] border-y-transparent
               border-r-[22px] border-primary -rotate-[15deg]"
        />
      </div>
    </div>

    <div class="!mt-3 !-mx-5 max-w-[100vw]">
      <Carousel v-if="cards && cards.length" v-bind="carouselConfig">
        <Slide v-for="card in cards" :key="card.id">
          <AppCard :text-first="card.word.original" :text-second="card.word.translated" :word-id="card.word.id" :is-favorite-init="card.word.isFavorite" />
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
        class="col-span-2 border-secondary shadow-secondary border-2 rounded-xl"
        @click="onTestPressed"
      >
        <div class="flex items-center justify-center rounded-xl min-h-[125px]">
          <span class="text-regular font-bold uppercase">{{ $t('test') }}</span>
        </div>
      </AppDelayedElement>
    </div>

    <div v-else class="flex flex-col mt-5">
      <div class="w-full text-center flex items-center gap-5">
        <div class="flex flex-col w-full p-4 bg-primary text-white rounded-xl">
          <span class="font-accent text-[96px] leading-[90px]">{{ category.users.length }}</span>
          <span class="text-regular leading-[16px] font-bold">пользователей</span>
          <span class="text-[10px] font-bold">добавили этот курс</span>
        </div>
        <div v-if="avarageRate" class="flex flex-col w-full p-4 bg-secondary text-white rounded-xl">
          <span class="font-accent text-[96px] leading-[90px]">{{ avarageRate }}</span>
          <span class="text-regular leading-[16px] font-bold">средняя оценка курса</span>
        </div>
      </div>
      <AppButton class="mt-5" :type="ButtonTypes.SECONDARY" outline @click="addUser">
        {{ $t('button.add-course') }}
      </AppButton>
    </div>

    <ConfirmModal
      v-model="modal" :title="$t('attention')" :description="modelDescription"
      :btn-left="$t('button.cancel')" :btn-right="$t('button.delete')" @close="modal = false" @confirm="onConfirm"
    />

    <ConfirmModal
      v-model="rateModal" :title="isRateModalEdit ? $t('modal.rate-edit.title') : $t('modal.rate.title')"
      :description="isRateModalEdit ? $t('modal.rate-edit.description') : $t('modal.rate.description')"
      :btn-left="$t('button.cancel')" :btn-right="isRateModalEdit ? $t('button.save') : $t('button.rate')"
      @close="rate = 0; rateModal = false" @confirm="rateCategory"
    >
      <div class="flex gap-1">
        <MotionComponent
          v-for="n in 5" :key="n" :initial="{ opacity: 0.8, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1 }" :leave="{ opacity: 0.8, scale: 0.8 }"
          :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
        >
          <AppIcon
            v-show="n <= rate" icon="star-filled" color="text-secondary-2" :width="36" :height="36"
            @click="rate = n"
          />
          <AppIcon v-show="n > rate" icon="star" :width="36" :height="36" @click="rate = n" />
        </MotionComponent>
      </div>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/assets/types/user'
import { useRouterUtility, useUserStore } from '#imports'
import { MotionComponent } from '@vueuse/motion'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
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

const { category, cards } = storeToRefs(useCategoryStore())
const { user } = storeToRefs(useUserStore())

const { getCategoryCards, getCategory } = useCategoryStore()

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

const modalState = ref<'edit' | 'delete' | 'restart'>('edit')
const modal = ref(false)
const rateModal = ref(false)
const isRateModalEdit = ref(false)
const rate = ref(0)
const modelDescription = computed(() => {
  if (modalState.value === 'restart') {
    return t('modal.description.restart')
  }
  return t('modal.description.delete')
})

const isCreator = computed(() => category?.value?.users.some(u => u.id === user.value?.id && u.role === 'creator'))
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

function onTestPressed() {
  if (+percent.value === 100) {
    modalState.value = 'restart'
    modal.value = true
  }
  else {
    router.push(`${route.path}/test`)
  }
}

function goToEdit() {
  router.push(`/category/create/${category.value?.id}`)
}

async function rateCategory() {
  if (category.value) {
    try {
      await categoryService.rateCategory(category.value?.id, rate.value)
      rateModal.value = false
      rate.value = 0
      getCategory(category.value.id)
    }
    catch {

    }
  }
}

const myRate = computed(() => {
  return category.value?.users.find((u: User) => u.id === user.value?.id)?.rate
})
const myCompilationCount = computed(() => {
  return category.value?.users.find((u: User) => u.id === user.value?.id)?.completionСount
})
const avarageRate = computed(() => {
  const userWithRates = category.value?.users.filter(u => u.rate)
  if (userWithRates) {
    return userWithRates.reduce((sum, user) => {
      return sum + user.rate
    }, 0) / userWithRates.length
  }
  return 0
})

const description = ref()
const isDescriptionOverflow = ref(false)

async function checkTruncation() {
  return setTimeout(() => {
    const el = description.value
    if (!el)
      return

    // Клонируем элемент без line-clamp
    const clone = el.cloneNode(true)
    clone.style.cssText = `
    position: absolute;
    visibility: hidden;
    height: auto;
    width: ${el.offsetWidth}px;
    max-height: none;
    -webkit-line-clamp: unset;
    display: -webkit-box;
    text-overflow: unset;
    -webkit-box-orient: vertical;
  `
    document.body.appendChild(clone)

    const clampedHeight = el.offsetHeight
    const fullHeight = clone.offsetHeight

    document.body.removeChild(clone)

    isDescriptionOverflow.value = fullHeight > clampedHeight
  }, 100) // Ждём, пока Vue обновит DOM
}
const isExpanded = ref(false)
onMounted(async () => {
  await getCategoryCards(route.params.id as string)
  await checkTruncation()
  const { data } = await testService.getProgress(route.params.id as string)
  if (data.value) {
    percent.value = data.value
  }

  if (!isCreator.value && myCompilationCount.value && myCompilationCount.value > 0 && !myRate.value) {
    isRateModalEdit.value = false
    rateModal.value = true
  }
})
</script>

<style scoped>
.truncate-text {
  display: -webkit-box;
  /* Required for -webkit-line-clamp to work */
  -webkit-box-orient: vertical;
  /* Required for vertical clamping */
  -webkit-line-clamp: 3;
  /* Limit to 3 lines */
  overflow: hidden;
  /* Hide overflowing content */
  text-overflow: ellipsis;
  /* Add ellipsis for truncated text */
}
</style>
