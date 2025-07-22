<template>
  <div>
    <input
      v-model="model" :placeholder="placeholder" type="text" required
      class="border-b-[1px] border-dark w-full h-[32px] text-small font-medium text-dark placeholder:text-small placeholder:text-hint-gray placeholder:font-medium"
    >
    <label>{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineModel } from 'vue'

export default defineComponent({
  props: {
    label: String,
    placeholder: String,
  },
  setup() {
    const model = defineModel()

    return { model }
  },
})
</script>

<style>

</style>
