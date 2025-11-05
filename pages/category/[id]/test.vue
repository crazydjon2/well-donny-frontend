<template>
  <div class="container overflow-hidden min-h-[100vh]">
    <PageTop type="primary">
      <template #left>
        <AppIcon icon="tuning" :width="22" :height="26" color="text-white" />
      </template>
      <template #default>
        {{ $t('test') }}
      </template>
      <template #right>
        <AppIcon icon="close" color="text-white" class="cursor-pointer" :width="16" :height="16" @click="goBack" />
      </template>
    </PageTop>
    <ShipProgress v-if="cards" :length="cards.length" :position="slide + 1" class="mt-5" />
    <div v-if="cards" class="mt-6">
      <FlashCardsContainer :key="renderKey" v-model="slide" :allow-swipe="false" :is-square="false">
        <FlashCardsItem v-for="(card) in cards" :key="card.id" class="flex flex-col overflow-visible p-1 relative">
          <div
            class="w-full !h-[200px] flex items-center bg-white justify-center border-secondary border-2 shadow-small-secondary rounded-3xl px-2"
          >
            <p class="truncate-text">{{ card.original }}</p>
          </div>

          <AppIcon icon="resize" :width="18" :height="18" class="absolute right-4 top-4" @click="openModal(card)" />
        </FlashCardsItem>

        <template #end-slide>
          <div class="w-full bg-grey rounded-3xl h-[200px] mb-auto" />
        </template>
      </FlashCardsContainer>

      <div v-if="correctWord" class="relative mt-8 w-full flex flex-col gap-4">
        <TransitionGroup name="move-up">
          <AppButton
            v-for="word in wordsPool" :key="word.id" outline full :custom-class="getButtonClass(word)"
            @click="showAnswer(word)"
          >
            <span class="text font-light">{{ word.translated }}</span>
          </AppButton>
        </TransitionGroup>
      </div>
      <div v-if="!wordsPool.length && !isEnd" class="w-full h-[200px]" />

      <Transition name="fade">
        <div v-if="isEnd" class="w-full text-center mt-5">
          <span v-if="cards.length" class="text-small font-normal text-center">{{ $t('learnt-text', { length: cards.length }) }}</span>
          <h3 class="font-accent text-[4rem] leading-[4rem]">
            Well donny!
          </h3>

          <div class="mt-8 text-small gap-2">
            <div v-if="cards.length" class="flex justify-between">
              <span>{{ $t('correct-answers') }}</span>
              <span>{{ statistic.right }}/{{ cards.length }}</span>
            </div>
            <div v-if="cards.length" class="flex justify-between">
              <span>{{ $t('need-to-learn') }}</span>
              <span>{{ statistic.wrong }}/{{ cards.length }}</span>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="move-up">
        <div v-if="isEnd" class="w-full flex justify-center gap-5 fixed bottom-5 px-5 left-0">
          <AppDelayedElement v-if="courseDone" @click="restartTest">
            <AppButton full outline :type="ButtonTypes.SECONDARY">
              {{ $t('button.more') }}
            </AppButton>
          </AppDelayedElement>
          <AppDelayedElement v-if="courseDone" @click="onCardsEnd">
            <AppButton full>
              {{ $t('button.finish') }}
            </AppButton>
          </AppDelayedElement>

          <AppDelayedElement v-if="!courseDone" @click="nextRound">
            <AppButton full :type="ButtonTypes.SECONDARY">
              {{ $t('button.next') }}
            </AppButton>
          </AppDelayedElement>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" async setup>
import type { Word } from '~/assets/types/word'
import { pickWords, useGlobalStore, useModalStore, useRouterUtility } from '#imports'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ButtonTypes } from '~/assets/types/ui'
import PageTop from '~/components/PageTop.vue'
import ShipProgress from '~/components/ShipProgress.vue'
import { AppButton, AppDelayedElement, AppIcon } from '~/components/ui'
import FlashCardsContainer from '~/components/ui/flashCards/FlashCardsContainer.vue'
import FlashCardsItem from '~/components/ui/flashCards/FlashCardsItem.vue'
import { categoryService } from '~/services/categoryService'
import { testService } from '~/services/testService'
import { userStrickService } from '~/services/userStrickService'
import { useCategoryStore } from '~/stores/category'

const categoriesProgress = ref(0)
const router = useRouter()
const route = useRoute()

const { setMenuVisibility, setLightHouseState } = useGlobalStore()
const { category } = storeToRefs(useCategoryStore())
const { goBack } = useRouterUtility()

setLightHouseState(true)
const { data: cards, refresh } = await testService.getTestRound(route.params.id as string)
const slide = ref(0)

const pickedWord = ref<Word | null>(null)
const correctWord = computed<Word | null>(() => {
  if (cards.value && slide.value >= cards.value?.length) {
    return null
  }
  return cards.value ? cards.value[slide.value] : null
})
const wordsPool = computed<Word[]>(() => {
  if (cards.value && slide.value >= cards.value?.length) {
    return []
  }
  return cards.value ? pickWords(cards.value, cards.value[slide.value], 4) : []
})

const statistic = ref<{ wrong: number, right: number }>({ wrong: 0, right: 0 })
const delay = 500
function showAnswer(word: Word) {
  pickedWord.value = word

  if (correctWord.value) {
    testService.updateWord(route.params.id as string, correctWord.value.id, word.id === correctWord.value?.id)
  }

  if (word.id === correctWord.value?.id) {
    ++statistic.value.right
  }
  else {
    ++statistic.value.wrong
  }

  setTimeout(() => {
    pickedWord.value = null
    setTimeout(() => {
      slide.value = slide.value + 1
    }, 100)
  }, delay)
}

const isEnd = computed(() => {
  if (cards.value) {
    return slide.value === cards.value?.length
  }
  return false
})
const courseDone = ref(false)
watch(isEnd, async () => {
  if (isEnd.value) {
    const { data } = await testService.getProgress(category.value?.id as string)
    if (data.value && +data.value === 100) {
      courseDone.value = true
      if (category.value) {
        categoryService.markAsDone(category.value?.id)
      }
    }
    userStrickService.updateStrick()
    setMenuVisibility(false)
  }
}, { immediate: true })

function onCardsEnd() {
  setMenuVisibility(true)
  router.push(`/category/${route.params.id}`)
}

const renderKey = ref(1)
async function nextRound() {
  setMenuVisibility(true)
  await refresh()
  renderKey.value = renderKey.value + 1
  slide.value = 0
  statistic.value.right = 0
  statistic.value.wrong = 0
}

async function restartTest() {
  try {
    if (category.value) {
      await testService.restartCourse(category.value?.id)
      nextRound()
    }
  }
  catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('cdata') as string)
  if (data && category.value && data[category.value.id]) {
    categoriesProgress.value = data[category.value?.id]
  }

  setTimeout(() => {
    setLightHouseState(false)
  }, 300)
})
onBeforeUnmount(() => {
  if (category.value) {
    const categoriesData = JSON.parse(localStorage.getItem('cdata') as string) || {}
    localStorage.setItem('cdata', JSON.stringify({
      ...categoriesData,
      [category.value.id.toString()]: ((statistic.value.right + statistic.value.wrong) / (cards.value?.length || 1)) * 100,
    }))
  }
})
onUnmounted(() => {
  setMenuVisibility(true)
})

const correctClasses = '!bg-green !border-green !shadow-none translate-x-[-2px] translate-y-[2px]'
const wrongClasses = '!bg-red !border-red !shadow-none translate-x-[-2px] translate-y-[2px]'
function getButtonClass(word: Word) {
  if (!pickedWord.value)
    return ''

  if (word.id === correctWord.value?.id) {
    return correctClasses
  }

  if (pickedWord.value?.id === word.id && pickedWord.value.id !== correctWord.value?.id) {
    return wrongClasses
  }

  return ''
}

const { open } = useModalStore()
function openModal(card: Word) {
  open(card.original)
}
</script>

<style scoped>
.truncate-text {
  display: -webkit-box;
  /* Required for -webkit-line-clamp to work */
  -webkit-box-orient: vertical;
  /* Required for vertical clamping */
  -webkit-line-clamp: 3;
  /* Limit to 3 lines */
  overflow: hidden;
  /* Hide overflowing content */
  text-overflow: ellipsis;
  /* Add ellipsis for truncated text */
}
</style>
