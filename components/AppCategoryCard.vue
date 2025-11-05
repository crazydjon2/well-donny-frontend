<template>
  <div
    class="flex flex-col  relative border-2 rounded-xl p-4 aspect-square category"
    :class="primary ? 'border-primary shadow-small-primary' : 'border-secondary shadow-small-secondary'"
  >
    <span class="category__name">{{ props.category.name }}</span>
    <div class="flex items-center text-[8px] gap-1">
      <span>{{ category.categoriesTypes.type }}</span>
      <div v-if="rate" class="flex">
        <AppIcon icon="star-filled" color="text-secondary-2" :width="8" :height="8" class="relative top-[0.7px]" />
        {{ rate?.toFixed(1) }}
      </div>
    </div>
    <span class="category__author mt-auto w-fit" @click.stop.prevent="goToProfile">@{{ props.author.name }}</span>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Category } from '~/assets/types/category'
import type { User } from '~/assets/types/user'
import { useRouter } from 'vue-router'
import { AppIcon } from './ui'

const props = defineProps<{
  category: Category
  author: User
  description?: string
  primary?: boolean
  rate?: number
}>()

const router = useRouter()

function goToProfile() {
  router.push(`/profile/${props.author.id}`)
}
</script>

<style scoped>
.category__name {
  font-weight: 700;
  font-style: Bold;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.32px;
}

.category__author {
  font-family: Evolventa;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  line-height: 21px;
  letter-spacing: -0.32px;
  color: var(--color-primary);

  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 1rem;
}
</style>
