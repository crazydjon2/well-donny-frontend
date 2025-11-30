<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
    <AppLoader />
    <LightHouseLoading />
    <CardTextModal />
  </NuxtLayout>
</template>

<script setup lang="ts">
import AppLoader from './components/AppLoader.vue'
import LightHouseLoading from './components/LightHouseLoading.vue'
import CardTextModal from './components/modals/CardTextModal.vue'
</script>
