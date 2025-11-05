<template>
  <div>
    <input
      v-model="model" :placeholder="placeholder" type="text" required
      class="border-b-2 border-primary px-3 w-full h-[32px] text-small font-medium placeholder:text-small placeholder:text-hint-gray placeholder:font-medium"
      :class="[outline && 'border-primary !border-2 rounded-xl !p-3 min-h-[48px]', white && 'text-white border-white']"
    >
    <label class="text-[10px] pl-3 text-hint-gray" :class="white && 'text-white'">{{ props.label }}</label>
    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  outline?: boolean
  placeholder?: string
  error?: string
  white?: boolean
}>()

const model = defineModel()
</script>

<style>

</style>
