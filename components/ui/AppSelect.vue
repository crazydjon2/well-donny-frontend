<template>
  <div class="select relative z-10">
    <Dropdown :disabled="select" class="w-full" container=".select">
      <div
        class="border-b-2 border-primary px-3 w-full h-[32px] text-small font-medium placeholder:text-small placeholder:text-hint-gray placeholder:font-medium relative"
      >
        {{ model?.type || '' }}

        <AppIcon icon="arrow-up" :width="16" :height="16" class="absolute right-2 top-1.5 -rotate-180" />
      </div>
      <template #popper>
        <div class="w-full flex flex-col gap-4 p-4">
          <div
            v-for="(option, index) in options" :key="index" :value="option" class="text-small"
            @click="select = true; model = option;"
          >
            {{ option.type }}
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>
import { Dropdown } from 'floating-vue'
import { ref, watch } from 'vue'
import { AppIcon } from '@/components/ui'

defineProps<{ placeholder?: string, options: any[] }>()
const model = defineModel()

const select = ref(false)
watch(model, async () => {
  if (model.value) {
    await setTimeout(() => { }, 100)
    select.value = false
  }
})
</script>

<style>
.select .v-popper__popper {
  width: 100%;
}
</style>
