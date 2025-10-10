<template>
  <div class="container !pb-[200px]">
    <PageTop type="primary-light">
      <div class="flex justify-between">
        {{ profile?.name }}
        <AppIcon v-if="isMe" icon="settings" color="text-white" :width="36" :height="36" />
      </div>
    </PageTop>

    Tg data: {{ tgUserData }}
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

    <div v-if="isMe" class="flex max-w-[500px] mx-auto my-6">
      <Calendar v-bind="calendarConfig" :attributes="calendarAttributes" />
    </div>

    <div class="mt-6">
      <h3 class="text-[1.5rem] font-bold text-center">
        КУРСЫ
      </h3>
      <Carousel v-bind="carouselConfig">
        <Slide v-for="category in categories" :key="category.id">
          <AppDelayedElement :to="`/category/${category.category.id}`">
            <AppCategoryCard :category="category.category" :author="category.user" class="w-full">
              <AppIcon icon="chevron-left" :width="20" :height="20" class="absolute right-6 bottom-6 rotate-180" />
            </AppCategoryCard>
          </AppDelayedElement>
        </Slide>
      </Carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CalendarProps } from 'v-calendar/dist/types/src/use/calendar.js'
import type { AttributeConfig } from 'v-calendar/dist/types/src/utils/attribute.js'
import { useCookie } from '#app'
import { storeToRefs } from 'pinia'
import { Calendar } from 'v-calendar'
import { computed, ref, watch } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppCategoryCard from '~/components/AppCategoryCard.vue'
import PageTop from '~/components/PageTop.vue'
import { AppDelayedElement, AppIcon } from '~/components/ui'
import { authService } from '~/services/authService'
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
  highlight: true, // Boolean, String, Object
}])

const { data: profileData } = await authService.getProfile(route.params.id === 'me' ? user.value.id : route.params.id as string)
if (profileData.value) {
  setProfile(profileData.value)
}

const { data: categories } = await categoriesService.getAllCategories({
  userId: profile.value?.id,
  type: '',
  role: 'creator',
})

const { data: strickData } = await userStrickService.getStrick(new Date().toDateString())

const carouselConfig = {
  itemsToShow: 2,
  gap: 24,
}

const isMe = computed(() => {
  return route.params.id === 'me' || route.params.id === user.value?.id
})

watch(pickedLocale, () => {
  locale.value = pickedLocale.value.type
  localCookie.value = locale.value
})

watch(strickData, () => {
  calendarAttributes.value[0].dates = strickData.value
}, { immediate: true })

const tgUserData = Telegram.WebApp.initDataUnsafe.user
</script>
