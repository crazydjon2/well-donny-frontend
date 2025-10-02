<template>
  <button
    class="flex justify-center text-white rounded-xl py-5 px-4 cursor-pointer app-button" :class="[buttonClasses, [customClass]]"
  >
    <span>
      <slot>{{ $t('ui.button') }}</slot>
    </span>
  </button>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'

export default defineComponent({
  props: {
    full: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<ButtonTypes>,
      default: ButtonTypes.PRIMARY,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: '',
    },
    outline: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonClasses = computed(() => {
      return {
        'bg-primary border-primary border-[2px] shadow-primary active:!text-white active:bg-primary-2 active:border-primary-2': props.type === ButtonTypes.PRIMARY,
        'bg-secondary border-secondary border-[2px] shadow-secondary active:!text-white active:bg-secondary-2 active:border-secondary-2': props.type === ButtonTypes.SECONDARY,
        'w-full': props.full,
        'w-min-[165px]': !props.full,
        '!bg-light !text-dark button--disabled': props.disabled,
        'bg-white !text-dark': props.outline,
      }
    })

    return {
      buttonClasses,
    }
  },
})
</script>

<style scoped>
span {
  font-weight: 700;
  font-size: 20px;
  line-height: 21px;
  letter-spacing: -0.32px;
  text-align: center;
  text-transform: uppercase;

}

.button--disabled {
  opacity: 0.5;
  pointer-events: none;
  touch-action: none;
}

.app-button.bg-primary.active {
  background: var(--color-primary-2);
  border-color: var(--color-primary-2);
}
.app-button.bg-secondary.active {
  background: var(--color-secondary-2);
  border-color: var(--color-secondary-2);
}
</style>
