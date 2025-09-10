<template>
  <div class="fixed inset-x-0 mx-auto w-fit bottom-5 z-50">
    <div class="flex gap-8 justify-between bg-primary w-full shadow-small-primary py-2.5 px-4 rounded-3xl mx-5">
      <AppDelayedElement v-slot="{ isActive }" to="/">
        <div class="flex flex-col items-center">
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
      <AppDelayedElement v-slot="{ isActive }" to="/profile">
        <div class="flex flex-col items-center">
          <AppIcon icon="anchor" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">{{ $t('menu.profile') }}</span>
        </div>
      </AppDelayedElement>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AppIcon, AppDelayedElement} from './ui'
</script>

<style scoped>
span {
  font-weight: 700;
  font-style: Bold;
  font-size: 10px;
  leading-trim: NONE;
  line-height: 21px;
  letter-spacing: -0.32px;
  text-align: center;
}
</style>
