<template>
  <div class="fixed inset-x-0 mx-auto w-fit bottom-5 z-50">
    <div class="flex gap-8 justify-between bg-primary shadow-small-primary py-2.5 px-4 rounded-3xl mx-5">
      <NuxtLink v-slot="{ isActive }" to="/">
        <div class="flex flex-col items-center w-fit">
          <AppIcon icon="book" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">мои курсы</span>
        </div>
      </NuxtLink>
      <NuxtLink v-slot="{ isActive }" to="/library">
        <div class="flex flex-col items-center w-fit">
          <AppIcon icon="hat" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">библиотека</span>
        </div>
      </NuxtLink>
      <NuxtLink v-slot="{ isActive }" to="/profile">
        <div class="flex flex-col items-center w-fit">
          <AppIcon icon="anchor" :color="isActive ? 'text-link-active' : 'text-white'" :width="36" :height="36" />
          <span :class="isActive ? 'text-link-active' : 'text-white'">профиль</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from './ui/AppIcon.vue'

export default defineComponent({
  components: { AppIcon },
  setup() {

  },
})
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
