<template>
  <ModalFull v-model="model" class="modal" @close="model = false">
    <div class="p-5 bg-white rounded-3xl">
      <PageTop type="secondary" with-decoration>
        <template #default>
          <div class="w-full relative">
            <p class="font-accent text-[32px] font-bold">
              настройки профиля
            </p>

            <AppIcon icon="close" :width="18" :height="18" color="text-white absolute top-1.5 right-0" @click="model = false" />
          </div>
        </template>
      </PageTop>

      <div class="mt-4 flex flex-col gap-2">
        <div class="flex items-center justify-center w-full" @click="isProfilePublic = !isProfilePublic">
          <span class="text-regular">Сделать профиль публичным</span>
          <AppCheckbox :value="isProfilePublic" class="ml-auto" />
        </div>
        <div class="flex items-center justify-center w-full" @click="notification = !notification">
          <span class="text-regular">Получать уведомления в tg</span>
          <AppCheckbox :value="notification" class="ml-auto" />
        </div>
        <div class="flex items-center justify-center w-full">
          <span class="text-regular">Язык приложения</span>
          <Dropdown :disabled="select" class="ml-auto" container=".modal">
            <div class="border-primary shadow-small-primary border-[1px] rounded-md px-1 flex items-center">
              <span class="mr-1">{{ localeData }}</span>
              <div class="border-l-[1px] h-[26px] flex flex-col items-center justify-center border-primary">
                <AppIcon icon="chevron-left" :width="16" :height="10" color="text-black -rotate-90" />
              </div>
            </div>
            <template #popper>
              <div class="w-full flex flex-col gap-4 p-4 !z-0 relative">
                <div v-for="item in languages" :key="item.value" @click="setLocale(item.value)">
                  {{ item.text }}
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
        <!-- <div class="flex items-center justify-center w-full">
          <span class="text-regular">Тёмная тема</span>
          <AppCheckbox class="ml-auto" />
        </div> -->
      </div>

      <div class="flex gap-6 mt-8">
        <AppButton full outline :type="ButtonTypes.SECONDARY" @click="model = false">
          отмена
        </AppButton>
        <AppButton full @click="sendData">
          сохранить
        </AppButton>
      </div>
    </div>
  </ModalFull>
</template>

<script lang="ts" setup>
import type { SupportedLanguage } from 'storybook/internal/components'
import { useCookie } from '#app'
import { storeToRefs, useUserStore } from '#imports'
import { Dropdown } from 'floating-vue'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ButtonTypes } from '~/assets/types/ui'
import { authService } from '~/services/userService'
import PageTop from '../PageTop.vue'
import { AppButton, AppCheckbox, AppIcon } from '../ui'
import ModalFull from './ModalFull.vue'

const model = defineModel<boolean>()
const { user } = storeToRefs(useUserStore())
const { locale } = useI18n()

const localeData = ref(user.value?.language)
const languages = [
  {
    text: 'russian',
    value: 'ru',
  },
  {
    text: 'english',
    value: 'en',
  },
]

const select = ref(false)
const isProfilePublic = ref(user.value?.isPublic)
const notification = ref(user.value?.allowNotification)

function setLocale(localeCode: SupportedLanguage) {
  if (localeCode) {
    localeData.value = localeCode as SupportedLanguage

    select.value = true

    setTimeout(() => {
      select.value = false
    }, 100)
  }
}

async function sendData() {
  await authService.editProfile({
    isPublic: isProfilePublic.value as boolean,
    allowNotification: notification.value as boolean,
    language: localeData.value as SupportedLanguage,
  })
  useUserStore().getUser()
  model.value = false
  if (locale.value !== localeData.value) {
    useCookie('locale').value = localeData.value
    locale.value = localeData.value
    window.location.reload()
  }
}
</script>
