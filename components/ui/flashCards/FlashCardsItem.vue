<template>
  <div
    v-if="isActive || isNext || isPrev" class="relative flash-card z-10"
    :class="{ 'flash-card-no-click': !allowClick, '!absolute top-0 left-0 w-full h-full': isNext || isPrev, 'z-[1]': isNext, 'z-[20]': isPrev }"
    :style="cardStyle" @mousedown="startDrag" @touchstart="startDrag" @click.self="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { CardMethods, FlashCardsContext, MouseUpEvent, MoveEventRegister, TiltState } from './types'
import { computed, getCurrentInstance, inject, onUnmounted, ref, shallowRef, watch, watchEffect } from 'vue'

const emits = defineEmits<{ (e: 'onTilt', state: TiltState): TiltState }>()
const ACTIVE_STATE = 150
const startPos = ref({ x: 0, y: 0 })
const currentPos = shallowRef({ x: 0, y: 0 })
const isDragging = ref(false)
const allowClick = ref(true)
const cardStyle = computed(() => {
  return {
    transform: `translate(${currentPos.value.x / 2}px, ${currentPos.value.y / 15}px) rotate(${currentPos.value.x / 100}deg)`,
    transition: isDragging.value ? 'none' : 'transform 0.7s ease',
  }
})

const cardContext = inject<FlashCardsContext>('flashCardsContext')
if (!cardContext) {
  throw new Error('FlashCardsContext не был предоставлен')
}
const { currentSlide, items, registerItem, unregisterItem, setSlide } = cardContext
const instance = getCurrentInstance()
const localIndex = ref<number>(0)
const isActive = computed(() => (
  localIndex.value !== null && currentSlide.value === localIndex.value
))

const isNext = computed(() => (
  localIndex.value !== null && currentSlide.value + 1 === localIndex.value
))

const isPrev = computed(() => (
  localIndex.value !== null && currentSlide.value - 1 === localIndex.value
))

const isRightState = ref(false)
const isLeftState = ref(false)

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX
  const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY

  startPos.value = { x: clientX, y: clientY }
  currentPos.value = { x: 0, y: 0 }

  // Для touch-устройств предотвращаем скролл страницы
  if ('touches' in e) {
    document.body.style.overflow = 'hidden'
  }
}

const onMove = inject<MoveEventRegister>('onMove')
if (onMove) {
  onMove(onDrag)
}
const tiltState = ref<TiltState>('center')
function onDrag(e: MouseEvent | TouchEvent) {
  if (isDragging.value) {
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY

    if (Math.abs(clientX - startPos.value.x) > 10) {
      allowClick.value = false
    }

    if (clientX - startPos.value.x > ACTIVE_STATE) {
      if (tiltState.value !== 'right') {
        tiltState.value = 'right'
      }
    }
    else if (clientX - startPos.value.x < -ACTIVE_STATE) {
      if (tiltState.value !== 'left') {
        tiltState.value = 'left'
      }
    }
    else {
      if (tiltState.value !== 'center') {
        tiltState.value = 'center'
      }
    }

    currentPos.value = { x: clientX - startPos.value.x, y: clientY - startPos.value.y }
  }
}

const onMouseUp = inject<MouseUpEvent>('onMouseUp')
if (onMouseUp) {
  onMouseUp(endDrag)
}

function endDrag() {
  if (isActive.value) {
    isDragging.value = false

    if (currentSlide.value === items.value.length - 1) {
      currentPos.value = { x: 0, y: 0 }
    }
    else if (currentPos.value.x > ACTIVE_STATE) {
      setSlide(currentSlide.value + 1)
      tiltState.value = 'center'
      markState('right')
    }
    else if (currentPos.value.x < -ACTIVE_STATE) {
      setSlide(currentSlide.value + 1)
      tiltState.value = 'center'
      markState('left')
    }
    else {
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
    }
    else if (state === 'right') {
      isRightState.value = true
      isLeftState.value = false
    }
  }
}

function handleClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  return false
}

if (instance) {
  localIndex.value = registerItem(instance.uid)
}

onUnmounted(() => {
  if (instance) {
    unregisterItem(instance.uid)
  }
})

watch(currentSlide, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (newValue > oldValue && isPrev.value) {
      currentPos.value = { x: Math.sign(isLeftState.value ? -1 : 1) * window.innerWidth * 3, y: 300 }
    }
    else if (newValue < oldValue && isActive.value) {
      currentPos.value = { x: 0, y: 0 }
    }
  }
})

watch(tiltState, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    emits('onTilt', tiltState.value)
  }
})

const currentCardMethods = inject<Ref<CardMethods>>('cardMethods')
watchEffect(() => {
  if (!currentCardMethods?.value)
    return

  if (isActive.value) {
    currentCardMethods.value.accept = () => {
      markState('right')
    }
    currentCardMethods.value.reject = () => {
      markState('left')
    }
  }
})
</script>

<style>
.flash-card-no-click * {
  pointer-events: none;
  touch-action: none;
}
</style>
