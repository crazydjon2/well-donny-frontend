<template>
  <div class="card rounded-3xl select-none aspect-square bg-white h-full" :class="[size]" :style="cardStyle" @click="startAnimation">
    <div
      class="relative card__inner shadow-small-primary border-2 border-primary flex items-center justify-center h-full w-full aspect-square rounded-3xl"
      :class="[{ 'card--flip shadow-small-fliped-primary': isFlipped }, large ? 'p-8' : 'p-4']"
    >
      <div class="card__face card__front">
        <p :class="{ 'font-bold': large }" class="text-center" @click.prevent>
          {{ textFirst }}
        </p>

        <div
          v-if="large"
          class="absolute"
          :class="large ? 'left-8 top-8' : 'left-4 top-4'"
        >
          <span class="card__text">{{ wordCurrent }}/{{ wordMax }}</span>
        </div>
        <AppIcon
          v-if="large"
          icon="star"
          class="absolute"
          :class="large ? 'right-8 top-8' : 'right-4 top-4'"
          small
        />
        <AppIcon
          v-if="large"
          icon="back"
          class="absolute cursor-pointer"
          :class="large ? 'left-8 bottom-8' : 'left-4 bottom-4'"
          small
          @click.stop="$emit('onBackPressed')"
        />
        <AppIcon
          icon="refresh"
          class="absolute cursor-pointer"
          :class="large ? 'right-8 bottom-8' : 'right-4 bottom-4'"
          small
          @click.stop="startAnimation"
        />
      </div>
      <div class="card__face card__back">
        <p :class="{ 'font-bold': large }" class="text-center" @click.prevent>
          {{ textSecond }}
        </p>

        <div
          v-if="large"
          class="absolute"
          :class="large ? 'left-8 top-8' : 'left-4 top-4'"
        >
          <span class="card__text">{{ wordCurrent }}/{{ wordMax }}</span>
        </div>
        <AppIcon
          v-if="large"
          icon="star"
          class="absolute"
          :class="large ? 'right-8 top-8' : 'right-4 top-4'"
          small
        />
        <AppIcon
          v-if="large"
          icon="back"
          class="absolute cursor-pointer"
          :class="large ? 'left-8 bottom-8' : 'left-4 bottom-4'"
          small
          @click.stop="$emit('onBackPressed')"
        />
        <AppIcon
          icon="refresh"
          class="absolute cursor-pointer"
          :class="large ? 'right-8 bottom-8' : 'right-4 bottom-4'"
          small
          @click.stop="startAnimation"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
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
  },
  emits: ['flipStarted', 'flipEnded', 'onBackPressed'],
  setup(props, ctx) {
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

    return { size, cardStyle, startAnimation, isFlipped, paddingConst }
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
</style>
