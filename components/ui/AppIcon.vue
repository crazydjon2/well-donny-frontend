<template>
  <div>
    <component :is="iconComponent" :class="colorClass" :style="sizeStyle" />
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0
    },
    small: {
      type: Boolean,
      default: false
    },
    big: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const iconComponent = ref(defineAsyncComponent(() => import(`@/assets/icons/${props.icon}.svg`)))

    
    const colorClass = computed(() => props.color)

    const sizeStyle = computed(() => ({
      width: props.width ? `${props.width}px` : props.small ? '20px' : props.big ? '40px' : undefined,
      height: props.height ? `${props.height}px` : props.small ? '20px' : props.big ? '40px' : undefined
    }))

    watch(() => props.icon, () => {
      iconComponent.value = defineAsyncComponent(() => import(`@/assets/icons/${props.icon}.svg`))
    })

    return { iconComponent, colorClass, sizeStyle }
  }
})
</script>