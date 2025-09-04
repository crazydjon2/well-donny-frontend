<template>
  <div class="container">
    <PageTop type="primary">
      <template #left>
        <AppIcon icon="tuning" :width="22" :height="26" color="text-white" />
      </template>
      <template #default>
        Тест
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>
    <ShipProgress v-if="cards" :length="cards.length" :position="slide + 1" class="mt-5" />
    <div v-if="cards" class="mt-6">
      <FlashCardsContainer v-model="slide" :allow-swipe="false">
        <FlashCardsItem v-for="(card) in cards" :key="card.id" class="flex flex-col overflow-visible p-1">
          <div
            class="w-full !h-[200px] flex items-center bg-white justify-center border-secondary border-2 shadow-small-secondary rounded-3xl"
          >
            {{ card.word.original }}
          </div>
        </FlashCardsItem>
      </FlashCardsContainer>

      <div v-if="correctWord" class="relative mt-8 w-full flex flex-col gap-4">
        <TransitionGroup name="list">
          <AppButton
            v-for="word in wordsPool" :key="word.id" outline full
            :custom-class="pickedWord && word.id === correctWord.id ? '!bg-green !border-green !shadow-none' : (pickedWord && pickedWord.id === word.id) && pickedWord.id !== correctWord.id ? '!bg-red !border-red !shadow-none' : ''"
            @click="showAnswer(word)"
          >
            <span class="text font-light">{{ word.translated }}</span>
          </AppButton>
        </TransitionGroup>
      </div>
      <div v-if="!wordsPool.length" class="w-full h-[200px]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Word } from '~/assets/types/word'
import { pickWords, useRouterUtility } from '#imports'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import PageTop from '~/components/PageTop.vue'
import ShipProgress from '~/components/ShipProgress.vue'
import { AppButton, AppIcon } from '~/components/ui'
import FlashCardsContainer from '~/components/ui/flashCards/FlashCardsContainer.vue'
import FlashCardsItem from '~/components/ui/flashCards/FlashCardsItem.vue'
import { useCategoryStore } from '~/stores/category'

const { cards } = storeToRefs(useCategoryStore())
const { goBack } = useRouterUtility()

const slide = ref(0)

const pickedWord = ref<Word | null>(null)
const correctWord = computed<Word | null>(() => {
  if (cards.value && slide.value >= cards.value?.length) {
    return null
  }
  return cards.value ? cards.value[slide.value].word : null
})
const wordsPool = computed<Word[]>(() => {
  if (cards.value && slide.value >= cards.value?.length) {
    return []
  }
  return cards.value ? pickWords(cards.value?.map(card => card.word), cards.value[slide.value].word, 4) : []
})

const delay = 500
function showAnswer(word: Word) {
  pickedWord.value = word
  setTimeout(() => {
    pickedWord.value = null
    setTimeout(() => {
      slide.value = slide.value + 1
    }, 100)
  }, delay)
}
</script>
