<template>
  <div :class="startAnimation && 'error-animation'">
    <input
      ref="input"
      v-model="model" :placeholder="placeholder" type="text" required
      class="app-input border-b-2 border-primary px-3 w-full h-full text-small font-medium placeholder:text-small placeholder:text-hint-gray placeholder:font-medium"
      :class="[outline && 'border-primary !border-2 rounded-xl !p-3 min-h-[48px]', secondary && 'border-secondary shadow-secondary bg-white rounded-xl', white && 'text-white border-white', error && '!border-red !text-red placeholder:text-red', success && '!border-green !text-green placeholder:text-green']"
      @focus="onFocus"
    >
    <label class="text-[10px] pl-3 text-hint-gray" :class="[white && 'text-white']">{{ props.label }}</label>
    <p v-if="error" class="text-red text-regular">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  label?: string
  outline?: boolean
  placeholder?: string
  error?: string
  success?: string
  secondary?: boolean
  white?: boolean
}>()

const model = defineModel()

const startAnimation = ref(false)
watch(() => props.error, () => {
  if (props.error) {
    startAnimation.value = true
    setTimeout(() => {
      startAnimation.value = false
    }, 300)
  }
})

const input = ref<HTMLElement>()
async function onFocus() {
  await nextTick()
  if (input.value) {
    input.value.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }
}
</script>

<style scoped>
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

.app-input {
  scroll-margin-top: 120px; /* Adds a 50px offset from the top */
}
</style>
