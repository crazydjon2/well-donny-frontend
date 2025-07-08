<template>
  <div>
    <span>{{ text }}</span>

    <Transition name="fade">
      <div v-if="active" class="h-[1px] w-full bg-secondary" />
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup() {

  },
})
</script>

<style scoped>
span {
    font-weight: 400;
    font-style: Regular;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 21px;
    letter-spacing: -0.32px;
    text-align: center;
    text-transform: uppercase;
    color: var(--color-dark);

    word-break: keep-all;
    white-space: nowrap;
}
</style>
