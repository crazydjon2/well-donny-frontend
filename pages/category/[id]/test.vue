<template>
  <div>
    <AppPageHeader title="Тест">
      <template #default>
        <AppIcon icon="trash" :width="24" :height="24" color="text-white" class="absolute right-3" />
      </template>
    </AppPageHeader>

    <ShipProgress v-if="cards" :length="cards.length" :position="slide + 1" class="mt-5" />
    <div v-if="cards" class="mt-6">
      <Carousel v-model="slide" v-bind="carouselConfig">
        <Slide v-for="(card) in cards" :key="card.id" class="flex flex-col overflow-visible p-1">
          <div
            class="w-full !h-[200px] flex items-center justify-center border-secondary border-2 shadow-small-secondary rounded-3xl"
          >
            {{ card.word.original }}
          </div>

          <div class="mt-8 w-full flex flex-col gap-4">
            <AppButton
              v-for="word in wordsPool" :key="word.id" outline full
              :custom-class="pickedWord && word.id === correctWord.id ? '!bg-green !border-green !shadow-none' : (pickedWord && pickedWord.id === word.id) && pickedWord.id !== correctWord.id ? '!bg-red !border-red !shadow-none' : ''"
              @click="showAnswer(word)"
            >
              <span class="text font-light">{{ word.translated }}</span>
            </AppButton>
          </div>
        </Slide>
      </Carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Word } from '~/assets/types/word'
import { pickWords } from '#imports'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import AppPageHeader from '~/components/AppPageHeader.vue'
import ShipProgress from '~/components/ShipProgress.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useCategoryStore } from '~/stores/category'

const { cards } = storeToRefs(useCategoryStore())

const carouselConfig = {
  itemsToShow: 1,
  mouseDrag: false,
  touchDrag: false,
  gap: 20,
}

const slide = ref(0)

const pickedWord = ref<Word | null>(null)
const correctWord = ref<Word>(cards.value[slide.value].word)
const wordsPool = ref<Word[]>(pickWords(cards.value?.map(card => card.word), cards.value[slide.value].word, 4))

const delay = 500
function showAnswer(word: Word) {
  pickedWord.value = word
  setTimeout(() => {
    pickedWord.value = null
    slide.value = slide.value + 1
  }, delay)
}

watch(slide, () => {
  if (cards.value) {
    wordsPool.value = pickWords(cards.value?.map(card => card.word), cards.value[slide.value].word, 4)
    correctWord.value = cards.value[slide.value].word
  }
})
</script>
