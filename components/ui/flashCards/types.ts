import type { ComputedRef, Ref } from 'vue'

export type MoveHandler = (e: MouseEvent | TouchEvent) => void
export type MoveEventRegister = (handler: MoveHandler) => void

export type MouseUpEvent = (handler: (e: MouseEvent) => void) => void

export interface FlashCardsContext {
  currentSlide: ComputedRef<number>
  items: Ref<number[]>
  allowSwipe: boolean
  registerItem: (uid: number) => number
  unregisterItem: (uid: number) => void
  setSlide: (index: number) => void
}

export interface CardMethods {
  accept: () => void
  reject: () => void
}

export type TiltState = 'center' | 'left' | 'right'
