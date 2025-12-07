<script setup lang="ts">
import { navigateTo } from '#app'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  to?: string
  delay?: number
  tag?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
}

const props = withDefaults(defineProps<Props>(), {
  delay: 200,
  tag: 'div',
})

const element = ref<HTMLElement | null>(null)
const isProcessing = ref(false) // 🔥 защита от повторных кликов

function handleClick(event: MouseEvent) {
  if (isProcessing.value || props.disabled)
    return
  isProcessing.value = true

  event.preventDefault()

  const elementToAddActive
    = element.value && Array.from(element.value.classList).some(cl => cl.includes('shadow-'))
      ? element.value
      : (element.value?.children[0] ?? element.value)

  elementToAddActive?.classList.add('active')

  setTimeout(() => {
    if (props.to) {
      if (props.to.startsWith('/')) {
        navigateTo(props.to)
      }
      else if (props.to.startsWith('#')) {
        document.querySelector(props.to)?.scrollIntoView({ behavior: 'smooth' })
      }
      else {
        window.open(props.to, '_self')
      }
    }
    else if (props.onClick) {
      props.onClick(event)
    }

    isProcessing.value = false // 🔥 снова можно кликать
  }, props.delay)

  setTimeout(() => {
    elementToAddActive?.classList.remove('active')
  }, 150)
}

const route = useRoute()
const isActive = computed(() => {
  if (!props.to)
    return false
  return route.path === props.to
})
</script>

<template>
  <component
    :is="tag" ref="element" class="w-full cursor-pointer element" :class="props.disabled && 'disabled'"
    @click="handleClick"
  >
    <slot :is-active="isActive" />
  </component>
</template>

<style>
.element.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
