<template>
  <div @click="onClick" class="flex items-center cursor-pointer w-fit" :class="disabled || 'opacity-30 pointer-events-none'">
    <div class="relative w-[24px] h-[24px] rounded-lg border-dark border-[1px]">
      <Transition name="fade">
        <AppIcon v-if="modelValue" icon="check" color="text-primary" small class="absolute left-0.5 top-0.5" />
      </Transition>
    </div>
          <p class="ml-1">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppIcon from './AppIcon.vue';

export default defineComponent({
  components: { AppIcon },
  props: {
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onClick = () => {
      emit('update:modelValue', !props.modelValue)
    }
    return { onClick }
  }
})
</script>