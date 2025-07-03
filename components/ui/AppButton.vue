<template>
  <button class="flex justify-center text-white rounded-xl px-11 py-5" :class="buttonClasses">
    <span>
      <slot>{{ $t('ui.button') }}</slot>
    </span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'
import { ButtonTypes } from '~/assets/types/ui'

export default defineComponent({
  props: {
    full: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as PropType<ButtonTypes>,
      default: ButtonTypes.PRIMARY
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {

    const buttonClasses = computed(() => {
      return {
        'bg-primary active:bg-primary-2': props.type === ButtonTypes.PRIMARY,
        'bg-secondary active:bg-secondary-2': props.type === ButtonTypes.SECONDARY,
        'w-full': props.full,
        'max-w-[165px]': !props.full,
        '!bg-light !text-dark button--disabled': props.disabled,
      }
    })

    return {
      buttonClasses
    }
  }
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
}
</style>