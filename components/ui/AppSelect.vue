<template>
  <div>
    <select v-model="model" class="border-b-[1px] border-dark w-full h-[32px] text-small font-medium text-dark" :class="!model ? 'text-hint-gray' : ''">
      <option hidden :value="null" class="text-small font-medium ">{{ placeholder }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option" class="text-dark">
        {{ option.type }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { defineModel, defineProps } from 'vue'

const model = defineModel()
const props = defineProps<{ placeholder: string, options: any[] }>()
</script>
