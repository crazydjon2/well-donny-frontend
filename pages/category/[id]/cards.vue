<template>
  <div>
    <AppPageHeader title="Карточки">
      <template #default>
        <AppIcon icon="trash" :width="24" :height="24" color="text-white" class="absolute right-3" />
      </template>
    </AppPageHeader>

    <template v-if="cards">
      <ShipProgress :length="cards.length" :position="slide + 1" class="mt-5" />
    </template>

    <div v-if="cards" class="!mt-3">
      <FlashCardsContainer v-model="slide">
        <template v-for="(card, index) in cards" :key="card.id">
          <FlashCardsItem v-show="isFlipping ? slide === index : true">
            <AppCard :text-first="card.word.original" :text-second="card.word.translated" large :word-max="cards.length"
              :word-current="index + 1" @flip-started="isFlipping = true" @flip-ended="isFlipping = false"
              @on-back-pressed="slide--" />
          </FlashCardsItem>
        </template>

        <template #actions="{ onAcceptPressed, onRejectPressed }">
          <div class="w-full flex justify-center gap-5 mt-7">
            <AppButton full outline :disabled="slide === cards.length - 1" :type="ButtonTypes.SECONDARY"
              @click="onRejectPressed">
              не знаю
            </AppButton>
            <AppButton full outline :disabled="slide === cards.length - 1" @click="onAcceptPressed">
              Знаю
            </AppButton>
          </div>
        </template>
      </FlashCardsContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'
import ShipProgress from '~/components/ShipProgress.vue'
import { AppButton, AppIcon } from '~/components/ui'
// import { Carousel, Slide } from 'vue3-carousel'
import FlashCardsContainer from '~/components/ui/flashCards/FlashCardsContainer.vue'
import FlashCardsItem from '~/components/ui/flashCards/FlashCardsItem.vue'
import { useCategoryStore } from '~/stores/category'

const { cards } = storeToRefs(useCategoryStore())

const slide = ref(0)

const isFlipping = ref(false)
</script>
