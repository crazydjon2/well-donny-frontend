<template>
  <div class="card rounded-3xl select-none aspect-square bg-white h-full" :class="[size]" :style="cardStyle" @click="startAnimation">
    <div
      class="relative card__inner shadow-small-primary border-2 border-primary flex items-center justify-center h-full w-full aspect-square rounded-3xl"
      :class="[{ 'card--flip border-secondary shadow-small-fliped-secondary': isFlipped }, large ? 'p-8' : 'p-4', customClass]"
    >
      <div class="card__face card__front">
        <p :class="{ 'font-bold': large }" class="text-center truncate-text px-2" @click.prevent>
          {{ textFirst }}
        </p>

        <div
          class="absolute"
          :class="large ? 'left-4 top-4' : 'left-4 top-4'"
          @click.stop="openModal"
        >
          <AppIcon icon="resize" small />
        </div>
        <TransitionGroup name="fade">
          <AppIcon
            v-if="isFavorite"
            icon="star-filled"
            color="text-secondary"
            class="absolute"
            :class="large ? 'right-4 top-4' : 'right-4 top-4'"
            small
            @click.stop="resolveFavorite"
          />
          <AppIcon
            v-if="!isFavorite"
            icon="star"
            class="absolute"
            :class="large ? 'right-4 top-4' : 'right-4 top-4'"
            small
            @click.stop="resolveFavorite"
          />
        </TransitionGroup>
        <AppIcon
          v-if="large"
          icon="back"
          class="absolute cursor-pointer"
          :class="large ? 'left-4 bottom-4' : 'left-4 bottom-4'"
          small
          @click.stop="$emit('onBackPressed')"
        />
        <AppIcon
          icon="refresh"
          class="absolute cursor-pointer"
          :class="large ? 'right-4 bottom-4' : 'right-4 bottom-4'"
          small
          @click.stop="startAnimation"
        />
      </div>
      <div class="card__face card__back">
        <p :class="{ 'font-bold': large }" class="text-center truncate-text px-2" @click.prevent>
          {{ textSecond }}
        </p>

        <div
          class="absolute"
          :class="large ? 'left-4 top-4' : 'left-4 top-4'"
          @click.stop="openModal"
        >
          <AppIcon icon="resize" small />
        </div>
        <TransitionGroup name="fade">
          <AppIcon
            v-if="isFavorite"
            icon="star-filled"
            color="text-secondary"
            class="absolute"
            :class="large ? 'right-4 top-4' : 'right-4 top-4'"
            small
            @click.stop="resolveFavorite"
          />
          <AppIcon
            v-if="!isFavorite"
            icon="star"
            class="absolute"
            :class="large ? 'right-4 top-4' : 'right-4 top-4'"
            small
            @click.stop="resolveFavorite"
          />
        </TransitionGroup>
        <AppIcon
          v-if="large"
          icon="back"
          class="absolute cursor-pointer"
          :class="large ? 'left-4 bottom-4' : 'left-4 bottom-4'"
          small
          @click.stop="$emit('onBackPressed')"
        />
        <AppIcon
          icon="refresh"
          class="absolute cursor-pointer"
          :class="large ? 'right-4 bottom-4' : 'right-4 bottom-4'"
          small
          @click.stop="startAnimation"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useModalStore } from '#imports'
import { computed, defineComponent, ref } from 'vue'
import { authService } from '~/services/userService'
import AppIcon from './ui/AppIcon.vue'

export default defineComponent({
  components: { AppIcon },
  props: {
    textFirst: {
      type: String,
      required: true,
    },
    textSecond: {
      type: String,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
    wordMax: {
      type: Number,
      default: 0,
    },
    wordCurrent: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
    },
    customClass: {
      type: String,
      required: false,
    },
    wordId: {
      type: String,
      required: true,
    },
    isFavoriteInit: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['flipStarted', 'flipEnded', 'onBackPressed'],
  setup(props, ctx) {
    const { open } = useModalStore()
    const size = computed(() => {
      return props.height ? `h-[${props.height}px]` : ''
    })

    const paddingConst = props.large ? 8 : 4

    const animationDuration = 500
    const cardStyle = computed(() => {
      return {
        '--animation-delay': `${animationDuration}ms`,
      }
    })
    const isFlipped = ref(false)

    const startAnimation = () => {
      ctx.emit('flipStarted')
      isFlipped.value = !isFlipped.value
      setTimeout(() => {
        ctx.emit('flipEnded')
      }, animationDuration)
    }

    const openModal = () => {
      open(isFlipped.value ? props.textSecond : props.textFirst, '')
    }

    const isFavorite = ref(props.isFavoriteInit)
    const resolveFavorite = async () => {
      if (!isFavorite.value) {
        try {
          await authService.addWordToFavorite(props.wordId)
          isFavorite.value = true
        }
        catch (e) {
          console.error(e)
        }
      }
      else {
        try {
          await authService.removeWordToFavorite(props.wordId)
          isFavorite.value = false
        }
        catch (e) {
          console.error(e)
        }
      }
    }

    return { size, cardStyle, startAnimation, isFlipped, paddingConst, openModal, resolveFavorite, isFavorite }
  },
})
</script>

<style lang="scss" scoped>
.card__text {
  font-weight: 400;
  font-size: 20px;
  line-height: 21px;
  letter-spacing: -0.32px;
  text-align: center;
}

.card__inner {
  transition: var(--animation-delay);
  transform-style: preserve-3d;
}

.card--flip {
  transform: rotateY(180deg);
}

.card__face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card__back {
  transform: rotateY(180deg);
}

.truncate-text {
  display: -webkit-box; /* Required for -webkit-line-clamp to work */
  -webkit-box-orient: vertical; /* Required for vertical clamping */
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  overflow: hidden; /* Hide overflowing content */
  text-overflow: ellipsis; /* Add ellipsis for truncated text */
}
</style>
