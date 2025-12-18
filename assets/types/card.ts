import type { Word } from './word'

export interface Card {
  id: string
  word: Word
  stats: {
    failierCounter: number
    isAnswered: boolean
    successCounter: number
  }
}
