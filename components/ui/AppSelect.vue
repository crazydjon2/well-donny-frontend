<template>
  <div class="select relative" :class="startAnimation && 'error-animation'">
    <Dropdown :disabled="select" class="w-full" container=".select">
      <div
        class="border-b-2 border-primary px-3 w-full h-[32px] text-small font-medium placeholder:text-small placeholder:text-hint-gray placeholder:font-medium relative"
        :class="[!model?.type && 'text-hint-gray',  error && '!border-red !text-red']"
      >
        {{ model?.type || placeholder || '' }}

        <AppIcon icon="arrow-up" :width="16" :height="16" class="absolute right-2 top-1.5 -rotate-180" />
      </div>
      <span v-if="error" class="text-red text-regular">
        {{ error }}
      </span>
      <template #popper>
        <div class="w-full flex flex-col gap-4 p-4 !z-0 relative">
          <div
            v-for="(option, index) in options" :key="index" :value="option" class="text-small w-full"
            @click="onSelect(option)"
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

const props = defineProps<{ placeholder?: string, options: unknown[], error?: string }>()
const model = defineModel()

const select = ref(false)
function onSelect(option: any) {
  select.value = true
  model.value = option

  setTimeout(() => {
    select.value = false
  })
}

const startAnimation = ref(false)
watch(() => props.error, () => {
  if (props.error) {
    startAnimation.value = true
    setTimeout(() => {
      startAnimation.value = false
    }, 300)
  }
})
</script>

<style>
.select .v-popper__popper {
  width: 100%;
}

.error-animation {
  animation: shake 0.9s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}
</style>
