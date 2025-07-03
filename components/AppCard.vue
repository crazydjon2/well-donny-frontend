<template>
  <div class="card" :class="[size]" @click="startAnimation">
    <div
      class="relative card__inner bg-light flex items-center justify-center h-full w-full shadow-2xl aspect-square rounded-3xl"
      :class="[{ 'card--flip': isFlipped }, large ? 'p-8' : 'p-4']"
    >
      <div class="card__face card__front">
        <p>{{ textFirst }}</p>

        <div
          v-if="large"
          class="absolute"
          :class="large ? 'left-8 top-8' : 'left-4 top-4'"
        >
          <span class="card__text">{{ wordMax }}/{{ wordCurrent }}</span>
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
          class="absolute"
          :class="large ? 'left-8 bottom-8' : 'left-4 bottom-4'"
          small
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
        <p>{{ textSecond }}</p>

        <div
          v-if="large"
          class="absolute"
          :class="large ? 'left-8 top-8' : 'left-4 top-4'"
        >
          <span class="card__text">{{ wordMax }}/{{ wordCurrent }}</span>
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
          class="absolute"
          :class="large ? 'left-8 bottom-8' : 'left-4 bottom-4'"
          small
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
      type: String,
      default: '0',
    },
    wordCurrent: {
      type: String,
      default: '0',
    },
  },
  setup(props) {
    const size = computed(() => {
      return {
        'min-w-[350px] min-h-[350px]': props.large,
        'min-w-[225px] min-h-[225px]': !props.large,
      }
    })

    const paddingConst = props.large ? 8 : 4

    const isFlipped = ref(false)

    const startAnimation = () => {
      isFlipped.value = !isFlipped.value
    }

    return { size, startAnimation, isFlipped, paddingConst }
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
  transition: transform 0.6s;
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
