<template>
  <div>{{ user?.name }}</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '#imports'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())
</script>
