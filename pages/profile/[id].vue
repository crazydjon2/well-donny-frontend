<template>
  <div class="container">
    <PageTop type="primary-light">
      <div class="flex justify-between">
        {{ profile?.name }}
        <AppIcon v-if="isMe" icon="settings" color="text-white" :width="36" :height="36" @click="settingsModal = true" />
      </div>
    </PageTop>
    <div class="mt-6">
      <div class="flex gap-4">
        <div class="bg-grey w-full" />

        <div class="flex flex-col gap-4 w-full">
          <div class="flex flex-col justify-center items-center rounded-xl bg-primary aspect-square text-white">
            <h1 class="font-accent text-[6rem] leading-[90px]">
              {{ profile?.strick }}
            </h1>
            <p class="text-regular font-bold">
              дней
            </p>
            <p class="text-extra-small text-center font-bold">
              занимаешься без перерыва
            </p>
          </div>
          <div class="flex flex-col justify-center items-center rounded-xl bg-secondary aspect-square text-white">
            <h1 class="font-accent text-[6rem] leading-[90px]">
              {{ profile?.totalCompletionСount }}
            </h1>
            <p class="text-extra-small text-center font-bold">
              курсов пройдено
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

    <div class="mt-6">
      <h3 class="text-[1.5rem] font-bold text-center">
        КУРСЫ
      </h3>
      <Carousel v-bind="carouselConfig">
        <Slide v-for="category in userCategories" :key="category.id">
          <AppDelayedElement :to="`/category/${category.category.id}`">
            <AppCategoryCard :category="category.category" :author="category.user" class="w-full">
              <AppIcon icon="chevron-left" :width="20" :height="20" class="absolute right-6 bottom-6 rotate-180" />
            </AppCategoryCard>
          </AppDelayedElement>
        </Slide>
      </Carousel>
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
import { Carousel, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppCategoryCard from '~/components/AppCategoryCard.vue'
import ProfileSettingsModal from '~/components/modals/ProfileSettingsModal.vue'
import PageTop from '~/components/PageTop.vue'
import { AppDelayedElement, AppIcon } from '~/components/ui'
import { authService } from '~/services/userService'
import { categoriesService } from '~/services/categoriesService'
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

const calendarConfig: CalendarProps = {
  locale: locale.value,
  expanded: true,
}

const calendarAttributes: AttributeConfig = ref([{
  dates: [],
  highlight: true,
}])

const userCategories = ref<UsersCategory[]>([])
const userStrickData = ref()
onMounted(async () => {
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

const carouselConfig = {
  itemsToShow: 2,
  gap: 24,
}

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
