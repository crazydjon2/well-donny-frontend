<template>
  <div class="cursor-pointer">
    <span :class="{ 'chip--active': active }">{{ text }}</span>
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
  line-height: 21px;
  letter-spacing: -0.32px;
  text-align: center;
  text-transform: uppercase;
  color: var(--color-dark);

  word-break: keep-all;
  white-space: nowrap;

  text-decoration: underline rgba(255, 255, 255, 0);
  transition: text-decoration-color 300ms;
  text-underline-offset: 4px;
}

.chip--active {
  text-decoration-color: var(--color-secondary);
}
</style>
