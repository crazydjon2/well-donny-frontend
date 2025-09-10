<template>
  <div class="container overflow-hidden">
    <PageTop type="primary">
      <template #default>
        {{ $t('cards') }}
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" class="cursor-pointer" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>

    <template v-if="cards">
      <ShipProgress :length="cards.length" :position="slide + 1" class="mt-1" />
    </template>

    <div v-if="cards" class="mt-4">
      <FlashCardsContainer v-model="slide">
        <template v-for="(card, index) in cards" :key="card.id">
          <FlashCardsItem v-show="isFlipping ? slide === index : true" @on-tilt="tiltState = $event">
            <AppCard :text-first="card.word.original" :text-second="card.word.translated" large :word-max="cards.length"
              :word-current="index + 1" @flip-started="isFlipping = true" @flip-ended="isFlipping = false"
              :custom-class="cardClasses(index)" @on-back-pressed="slide--" />
          </FlashCardsItem>
        </template>

        <template #end-slide>
          <div class="h-full w-full bg-gray-200 rounded-3xl" />
        </template>

        <template #actions="{ onAcceptPressed, onRejectPressed }">
          <div v-if="!isEnd" class="w-full flex justify-center gap-5 mt-7 px-3">
            <AppDelayedElement @click="onRejectPressed">
              <AppButton full :outline="tiltState === 'center' || tiltState === 'right'"
                :disabled="slide === cards.length" :type="ButtonTypes.SECONDARY">
                {{ $t('button.dont-know') }}
              </AppButton>
            </AppDelayedElement>
            <AppDelayedElement @click="onAcceptPressed">
              <AppButton full :outline="tiltState === 'center' || tiltState === 'left'"
                :disabled="slide === cards.length">
                {{ $t('button.know') }}
              </AppButton>
            </AppDelayedElement>
          </div>
        </template>
      </FlashCardsContainer>

      <Transition name="fade">
        <div v-if="isEnd" class="w-full text-center mt-5">
          <span class="text-small font-normal text-center">{{ $t('learnt-all') }}</span>
          <h3 class="font-accent text-[4rem] leading-[4rem]">
            Well donny!
          </h3>
        </div>
      </Transition>

      <Transition name="move-up">
        <div v-if="isEnd" class="w-full flex justify-center gap-5 fixed bottom-5 px-5 left-0">
          <AppDelayedElement @click="refreshCards">
            <AppButton  full outline :type="ButtonTypes.SECONDARY">
              {{ $t('button.more') }}
            </AppButton>
          </AppDelayedElement>
          <AppDelayedElement @click="onCardsEnd">
          <AppButton full>
            {{ $t('button.finish') }}
          </AppButton>
          </AppDelayedElement>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore, useRouterUtility } from '#imports'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ButtonTypes } from '~/assets/types/ui'
import PageTop from '~/components/PageTop.vue'
import ShipProgress from '~/components/ShipProgress.vue'
import { AppButton, AppIcon, AppDelayedElement } from '~/components/ui'
// import { Carousel, Slide } from 'vue3-carousel'
import FlashCardsContainer from '~/components/ui/flashCards/FlashCardsContainer.vue'
import FlashCardsItem from '~/components/ui/flashCards/FlashCardsItem.vue'
import type { TiltState } from '~/components/ui/flashCards/types'
import { useCategoryStore } from '~/stores/category'

const router = useRouter()
const route = useRoute()

const { cards } = storeToRefs(useCategoryStore())
const { setMenuVisibility } = useGlobalStore()
const { goBack } = useRouterUtility()

const slide = ref(0)
const isFlipping = ref(false)

const isEnd = computed(() => {
  return slide.value === cards.value?.length
})
watch(isEnd, () => {
  if (isEnd.value) {
    setMenuVisibility(false)
  }
})

function onCardsEnd() {
  setMenuVisibility(true)
  router.push(`/category/${route.params.id}`)
}

function refreshCards() {
  setMenuVisibility(true)
  router.go(0)
}

const tiltState = ref<TiltState>('center')
const cardClasses = computed(() => (index: number) => {
  if (index !== slide.value) {
    return
  }
  if (tiltState.value === 'center') {
    return
  } else if (tiltState.value === 'left') {
    return '!bg-secondary !text-white !border-secondary shadow-small-secondary'
  } else {
    return '!bg-primary !text-white'
  }
})
</script>
