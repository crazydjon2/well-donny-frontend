<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
    <AppLoader />
    <LightHouseLoading />
  </NuxtLayout>
</template>

<script setup lang="ts">
import AppLoader from './components/AppLoader.vue'
import LightHouseLoading from './components/LightHouseLoading.vue'
</script>
