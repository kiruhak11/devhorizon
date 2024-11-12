<template>
  <button class="button" :class="extraClass" @click="$emit('click')">
    <slot />
  </button>
</template>

<script lang="ts" setup>
defineProps<{ extraClass?: string }>();
</script>

<style scoped lang="scss">
.button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  background-color: #0070f3;
  color: white;

  &:hover {
    background-color: #005bb5;
  }
}
</style>
