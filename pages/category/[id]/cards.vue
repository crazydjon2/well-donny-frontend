<template>
  <div class="container">
    <PageTop type="primary">
      <template #default>
        Карточки
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>

    <template v-if="cards">
      <ShipProgress :length="cards.length" :position="slide + 1" class="mt-1" />
    </template>

    <div v-if="cards" class="!mt-3">
      <FlashCardsContainer v-model="slide">
        <template v-for="(card, index) in cards" :key="card.id">
          <FlashCardsItem v-show="isFlipping ? slide === index : true">
            <AppCard
              :text-first="card.word.original" :text-second="card.word.translated" large :word-max="cards.length"
              :word-current="index + 1" @flip-started="isFlipping = true" @flip-ended="isFlipping = false"
              @on-back-pressed="slide--"
            />
          </FlashCardsItem>
        </template>

        <template #actions="{ onAcceptPressed, onRejectPressed }">
          <div class="w-full flex justify-center gap-5 mt-7">
            <AppButton
              full outline :disabled="slide === cards.length" :type="ButtonTypes.SECONDARY"
              @click="onRejectPressed"
            >
              не знаю
            </AppButton>
            <AppButton full outline :disabled="slide === cards.length" @click="onAcceptPressed">
              Знаю
            </AppButton>
          </div>
        </template>
      </FlashCardsContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouterUtility } from '#imports'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'
import PageTop from '~/components/PageTop.vue'
import ShipProgress from '~/components/ShipProgress.vue'
import { AppButton, AppIcon } from '~/components/ui'
// import { Carousel, Slide } from 'vue3-carousel'
import FlashCardsContainer from '~/components/ui/flashCards/FlashCardsContainer.vue'
import FlashCardsItem from '~/components/ui/flashCards/FlashCardsItem.vue'
import { useCategoryStore } from '~/stores/category'

const { cards } = storeToRefs(useCategoryStore())
const { goBack } = useRouterUtility()

const slide = ref(0)

const isFlipping = ref(false)
</script>
