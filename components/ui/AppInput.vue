<template>
  <div>
    <input
      v-model="model" :placeholder="placeholder" type="text" required
      class="border-b-[1px] border-dark w-full h-[32px] text-small font-medium text-dark placeholder:text-small placeholder:text-hint-gray placeholder:font-medium"
    >
    <label>{{ props.label }}</label>
    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  placeholder?: string
  error?: string
}>()

const model = defineModel()
</script>

<style>

</style>
