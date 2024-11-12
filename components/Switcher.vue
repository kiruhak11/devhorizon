<template>
  <button class="switcher" @click="toggleTheme">
    {{ isDark ? "Светлая тема" : "Темная тема" }}
  </button>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isDark = ref(false);

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}
</script>

<style scoped lang="scss">
.switcher {
  background: none;
  border: 1px solid var(--color-border);
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  color: var(--color-text);
  background-color: var(--color-primary);

  &:hover {
    background-color: var(--color-secondary);
  }
}
</style>
