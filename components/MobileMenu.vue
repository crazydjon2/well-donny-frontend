<template>
  <div class="fixed bottom-5 left-[calc(50%-122px)] z-50">
    <div class="flex w-fit mx-auto gap-8 justify-between bg-primary shadow-small-primary py-2.5 px-4 rounded-3xl">
      <AppDelayedElement v-slot="{ isActive }" to="/">
        <div class="flex flex-col items-center whitespace-nowrap">
          <AppIcon icon="book" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">{{ $t('menu.course') }}</span>
        </div>
      </AppDelayedElement>
      <AppDelayedElement v-slot="{ isActive }" to="/library">
        <div class="flex flex-col items-center">
          <AppIcon icon="hat" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">{{ $t('menu.library') }}</span>
        </div>
      </AppDelayedElement>
      <AppDelayedElement v-slot="{ isActive }" to="/profile/me">
        <div class="flex flex-col items-center">
          <AppIcon icon="anchor" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">{{ $t('menu.profile') }}</span>
        </div>
      </AppDelayedElement>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppDelayedElement, AppIcon } from './ui'
</script>

<style scoped>
span {
  font-weight: 700;
  font-style: Bold;
  font-size: 10px;
  line-height: 21px;
  letter-spacing: -0.32px;
  text-align: center;
}
</style>
