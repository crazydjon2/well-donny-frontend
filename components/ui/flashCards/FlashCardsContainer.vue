<template>
  <div>
    <div class="container relative">
      <slot />
      <slot name="end-slide">
        <FlashCardsItem class="a aspect-square flex items-center justify-center select-none">
          Конечный слайд
        </FlashCardsItem>
      </slot>
    </div>
    <slot name="actions" :on-reject-pressed="onRejectPressed" :on-accept-pressed="onAcceptPressed" />
  </div>
</template>

<script setup lang="ts">
import type { CardMethods, MoveEventRegister } from './types'
import { computed, onUnmounted, provide, ref } from 'vue'
import FlashCardsItem from './FlashCardsItem.vue'

const props = withDefaults(defineProps<{ allowSwipe?: boolean }>(), {
  allowSwipe: true,
})
const model = defineModel<number>({ default: 0 })

const items = ref<string[]>([])

// Регистрируем карточки
function registerItem(uid: string) {
  items.value.push(uid)
  return items.value.length - 1 // Возвращаем индекс
}

function unregisterItem(uid: string) {
  items.value = items.value.filter((id: string) => id !== uid)
}

function setSlide(index: number) {
  if (index > 0 && index < items.value.length) {
    model.value = index
  }
  else {
    model.value = index - 1
  }
}

provide('flashCardsContext', {
  currentSlide: computed(() => model.value),
  registerItem,
  unregisterItem,
  items,
  setSlide,
})

provide('onMouseUp', (callback: () => void) => {
  if (document && props.allowSwipe) {
    document.addEventListener('mouseup', callback)
    document.addEventListener('touchend', callback)
    document.addEventListener('touchcancel', callback)
  }
  onUnmounted(() => {
    document.removeEventListener('mouseup', callback)
    document.addEventListener('touchend', callback)
    document.removeEventListener('touchcancel', callback)
  })
})

const registerMoveHandler: MoveEventRegister = (callback) => {
  const handleMove = (e: Event) => {
    callback(e as MouseEvent | TouchEvent)
  }

  if (document && props.allowSwipe) {
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('touchmove', handleMove, { passive: false })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('touchmove', handleMove)
  })
}

provide('onMove', registerMoveHandler)

const currentCardMethods = ref<CardMethods>({
  accept: () => { },
  reject: () => { },
})

provide('cardMethods', currentCardMethods)
function onRejectPressed() {
  currentCardMethods.value.reject()
  setSlide(model.value + 1)
}
function onAcceptPressed() {
  currentCardMethods.value.accept()
  setSlide(model.value + 1)
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  gap: 15px;
}
</style>
