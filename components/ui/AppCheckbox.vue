<template>
  <div class="flex items-center cursor-pointer w-fit" :class="disabled && 'opacity-30 pointer-events-none'" @click="onClick">
    <slot />
    <div class="relative w-[24px] h-[24px] rounded-lg border-primary shadow-small-primary border-[2px]">
      <Transition name="fade">
        <AppIcon v-if="modelValue || value" icon="check" color="text-secondary" :width="30" :height="30" class="absolute -top-2 -left-1" />
      </Transition>
    </div>
    <p v-if="text" class="ml-1">
      {{ text }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from './AppIcon.vue'

export default defineComponent({
  components: { AppIcon },
  props: {
    text: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      required: false,
    },
    value: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onClick = () => {
      emit('update:modelValue', !props.modelValue)
    }
    return { onClick }
  },
})
</script>
