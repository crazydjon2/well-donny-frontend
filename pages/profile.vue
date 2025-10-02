<template>
  <div>
    <h1 class="font-accent text-5xl">ТУТ БУДЕТ ПРОФИЛЬ</h1>
    <div>
      <div>{{ user?.name }}</div>
    </div>
    <AppSelect v-model="pickedLocale" :options="[{ type: 'ru' }, { type: 'en' }]" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user';
import { AppSelect } from '~/components/ui';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import { useCookie } from '#app';

const { locale } = useI18n()
const localCookie = useCookie('locale')
const { user } = storeToRefs(useUserStore())

const pickedLocale = ref({
  type: locale.value
})

watch(pickedLocale, () => {
  locale.value = pickedLocale.value.type
  localCookie.value = locale.value
})
</script>
