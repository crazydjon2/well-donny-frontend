<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
    <AppLoader />
    <LightHouseLoading />
    <div class="z-100">
      aaaa{{ tgUserData }}
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import AppLoader from './components/AppLoader.vue'
import LightHouseLoading from './components/LightHouseLoading.vue'

const tgUserData = Telegram.WebApp.initDataUnsafe.user
</script>
