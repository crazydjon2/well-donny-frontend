<template>
  <div class="container !pb-30">
    <PageTop type="primary-light">
      <template #left>
        <span class="font-accent text-white text-meduim text-center px-2 !max-w-[calc(100%-50px)] w-full">{{ profile?.name }}</span>
      </template>
      <template #right>
        <div class="flex justify-between">
          <AppIcon v-if="isMe" icon="settings" color="text-white" :width="36" :height="36" @click="settingsModal = true" />
        </div>
      </template>
    </PageTop>
    <div class="mt-6">
      <div class="flex gap-4">
        <div class="w-full flex items-center">
          <img src="@/assets/img/donny.PNG" alt="Donny" class="animation-swim">
        </div>

        <div class="flex flex-col gap-4 w-full">
          <div class="flex flex-col justify-center items-center rounded-xl bg-primary aspect-square text-white">
            <h1 class="font-accent text-[6rem] leading-[90px]">
              {{ profile?.strick }}
            </h1>
            <p class="text-regular font-bold">
              {{ $t('profile.days') }}
            </p>
            <p class="text-extra-small text-center font-bold">
              {{ $t('profile.study') }}
            </p>
          </div>
          <div class="flex flex-col justify-center items-center rounded-xl bg-secondary aspect-square text-white">
            <h1 class="font-accent text-[6rem] leading-[90px]">
              {{ profile?.totalCompletionСount }}
            </h1>
            <p class="text-extra-small text-center font-bold">
              {{ $t('profile.done') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isMe" class="flex max-w-[500px] mx-auto my-6">
        <Calendar v-bind="calendarConfig" :attributes="calendarAttributes" />
      </div>
    </Transition>

    <div v-if="userCategories.length" class="mt-6">
      <h3 class="text-[1.5rem] font-bold text-center">
        {{ $t('courses') }}
      </h3>
      <div class="mt-3">
        <AppCarousel>
          <AppCarouselSlide v-for="category in userCategories" :key="category.id" :per-view="2">
            <NuxtLink :to="`/category/${category.category.id}`">
              <AppCategoryCard :category="category.category" :author="category.user" class="w-full">
                <AppIcon icon="chevron-left" :width="20" :height="20" class="absolute right-6 bottom-6 rotate-180" />
              </AppCategoryCard>
            </NuxtLink>
          </AppCarouselSlide>
        </AppCarousel>
      </div>
    </div>
    <ProfileSettingsModal v-model="settingsModal" />
  </div>
</template>

<script lang="ts" setup>
import type { CalendarProps } from 'v-calendar/dist/types/src/use/calendar.js'
import type { AttributeConfig } from 'v-calendar/dist/types/src/utils/attribute.js'
import type { UsersCategory } from '~/assets/types/usersCategories'
import { useCookie } from '#app'
import { storeToRefs } from 'pinia'
import { Calendar } from 'v-calendar'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppCategoryCard from '~/components/AppCategoryCard.vue'
import ProfileSettingsModal from '~/components/modals/ProfileSettingsModal.vue'
import PageTop from '~/components/PageTop.vue'
import { AppCarousel, AppCarouselSlide, AppIcon } from '~/components/ui'
import { categoriesService } from '~/services/categoriesService'
import { authService } from '~/services/userService'
import { userStrickService } from '~/services/userStrickService'
import { useUserStore } from '~/stores/user'
import 'v-calendar/style.css'

const { locale } = useI18n()
const localCookie = useCookie('locale')
const route = useRoute()

const { setProfile } = useUserStore()
const { user, profile } = storeToRefs(useUserStore())

const pickedLocale = ref({
  type: locale.value,
})

const calendarConfig: Partial<CalendarProps> = {
  locale: locale.value,
  expanded: true,
}

const calendarAttributes = ref<AttributeConfig[]>([{
  dates: [],
  highlight: true,
}])

const userCategories = ref<UsersCategory[]>([])
const userStrickData = ref()
onMounted(async () => {
  if (!user.value) {
    return
  }
  const [{ data: profileData }, { data: categories }, { data: strickData }] = await Promise.all([
    authService.getProfile(route.params.id === 'me' ? user.value.id : route.params.id as string),
    categoriesService.getAllCategories({
      userId: route.params.id === 'me' ? user.value.id : route.params.id as string,
      type: '',
      role: 'creator',
    }),
    userStrickService.getStrick(new Date()),
  ])

  if (profileData.value) {
    setProfile(profileData.value)
  }

  if (categories.value) {
    userCategories.value = categories.value
  }

  if (strickData.value) {
    userStrickData.value = strickData.value
  }
})

const isMe = computed(() => {
  return route.params.id === 'me' || route.params.id === user.value?.id
})

const settingsModal = ref(false)

watch(pickedLocale, () => {
  locale.value = pickedLocale.value.type
  localCookie.value = locale.value
})

watch(userStrickData, () => {
  calendarAttributes.value[0].dates = userStrickData.value
}, { immediate: true })
</script>
