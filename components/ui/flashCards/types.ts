import type { ComputedRef, Ref } from 'vue'

export type MoveHandler = (e: MouseEvent | TouchEvent) => void
export type MoveEventRegister = (handler: MoveHandler) => void

export type MouseUpEvent = (handler: () => void) => void

export interface FlashCardsContext {
  currentSlide: ComputedRef<number>
  items: Ref<number[]>
  registerItem: (uid: number) => number
  unregisterItem: (uid: number) => void
  setSlide: (index: number) => void
}

export interface CardMethods {
  accept: () => void
  reject: () => void
}

export type TiltState = 'center' | 'left' | 'right'
