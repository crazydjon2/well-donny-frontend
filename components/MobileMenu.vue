<template>
  <div class="fixed w-full bottom-5 left-0">
    <div class="flex justify-between bg-primary py-2.5 px-4 rounded-3xl mx-5">
      <div class="flex flex-col items-center w-fit">
        <AppIcon icon="hat" color="text-white" :width="36" :height="36" />
        <span>мои курсы</span>
      </div>
      <div class="flex flex-col items-center w-fit">
        <AppIcon icon="book" color="text-white" :width="36" :height="36" />
        <span>мои курсы</span>
      </div>
      <div class="flex flex-col items-center w-fit">
        <AppIcon icon="add" color="text-white" :width="36" :height="36" />
        <span>мои курсы</span>
      </div>
      <div class="flex flex-col items-center w-fit">
        <AppIcon icon="anchor" color="text-white" :width="36" :height="36" />
        <span>мои курсы</span>
      </div>
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
    color: var(--color-white);

}
</style>
