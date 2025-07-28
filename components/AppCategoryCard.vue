<template>
  <div class="flex flex-col border-primary relative border-2 rounded-xl p-4 aspect-square category">
    <span class="category__name">{{ category.name }}</span>
    <span class="category__author mt-auto">@{{ author.name }}</span>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Category } from '~/assets/types/category'
import type { User } from '~/assets/types/user'

defineProps<{
  category: Category
  author: User
  description?: string
}>()
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

}
.category {
  box-shadow: -2px 2px 0px 0px #00B0B4;
  transition: 0.3s;
}
.category:active {
  box-shadow: -1px 1px 0px 0px #00B0B4;
  transform: translateX(-1px) translateY(1px);

}
</style>
