<template>
  <div v-if="isActive || isNext || isPrev" class="flash-card z-10"
    :class="{ 'flash-card-no-click': !allowClick, 'absolute w-full h-full': isNext || isPrev, 'z-[1]': isNext, 'z-[20]': isPrev }"
    :style="cardStyle" @mousedown="startDrag" @touchstart="startDrag" @click.self="handleClick">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onUnmounted, ref, shallowRef, watch, watchEffect, type Ref } from 'vue'
import type { CardMethods, FlashCardsContext, MouseUpEvent, MoveEventRegister } from './types'

const startPos = ref({ x: 0, y: 0 })
const currentPos = shallowRef({ x: 0, y: 0 })
const isDragging = ref(false)
const allowClick = ref(true)
const cardStyle = computed(() => {
  return {
    transform: `translate(${currentPos.value.x / 2}px, ${currentPos.value.y / 4}px) rotate(${currentPos.value.x / 100}deg)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease',
  }
})

const isRightState = ref(false)
const isLeftState = ref(false)

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
  const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

  startPos.value = { x: clientX, y: clientY }
  currentPos.value = { x: 0, y: 0 }

  // Для touch-устройств предотвращаем скролл страницы
  if ('touches' in e) {
    document.body.style.overflow = 'hidden'
  }
}


const onMove = inject<MoveEventRegister>('onMove');
if (onMove) {
  onMove(onDrag)
}
function onDrag(e: MouseEvent | TouchEvent) {
  if (isDragging.value) {
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

    if (Math.abs(clientX - startPos.value.x) > 10) {
      allowClick.value = false
    }
    currentPos.value = { x: clientX - startPos.value.x, y: clientY - startPos.value.y }
  }
}

const cardContext = inject<FlashCardsContext>('flashCardsContext')
if (!cardContext) {
  throw new Error('FlashCardsContext не был предоставлен');
}
const { currentSlide, items, registerItem, unregisterItem, setSlide } = cardContext
function endDrag() {
  if (isActive.value) {
    isDragging.value = false

    if (currentSlide.value === items.value.length - 1) {
      currentPos.value = { x: 0, y: 0 }
    }
    else if (currentPos.value.x > 150) {
      setSlide(currentSlide.value + 1)
      markState('right')
    } else if (currentPos.value.x < -150) {
      setSlide(currentSlide.value + 1)
      markState('left')
    } else {
      currentPos.value = { x: 0, y: 0 }
    }

    setTimeout(() => {
      allowClick.value = true
    }, 500)
  }
}

function markState(state: 'left' | 'right' = 'left') {
  if (isActive.value) {
    if (state === 'left') {
      isLeftState.value = true
      isRightState.value = false
    } else if (state === 'right') {
      isRightState.value = true
      isLeftState.value = false
    }
  }
}

const onMouseUp = inject<MouseUpEvent>('onMouseUp')
if (onMouseUp) {
  onMouseUp(endDrag)
}

function handleClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  return false
}

const instance = getCurrentInstance()
const localIndex = ref<number>(0)

// Автоматическая регистрация
if (instance) {
  localIndex.value = registerItem(instance.uid)
}

onUnmounted(() => {
  if (instance) {
    unregisterItem(instance.uid)
  }
})

// Вычисляемые свойства
const isActive = computed(() => (
  localIndex.value !== null && currentSlide.value === localIndex.value
))

const isNext = computed(() => (
  localIndex.value !== null && currentSlide.value + 1 === localIndex.value
))

const isPrev = computed(() => (
  localIndex.value !== null && currentSlide.value - 1 === localIndex.value
))

watch(currentSlide, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (newValue > oldValue && isPrev.value) {
      currentPos.value = { x: Math.sign(isLeftState.value ? -1 : 1) * window.innerWidth * 3, y: 300 }
    } else if (newValue < oldValue && isActive.value) {
      currentPos.value = { x: 0, y: 0 }
    }
  }
})

const currentCardMethods = inject<Ref<CardMethods>>('cardMethods')
watchEffect(() => {
  if (!currentCardMethods?.value) return

  if (isActive.value) {
    currentCardMethods.value.accept = () => markState('right')
    currentCardMethods.value.reject = () => markState('left')
  }
})
</script>

<style>
.flash-card-no-click * {
  pointer-events: none;
  touch-action: none;
}
</style>
