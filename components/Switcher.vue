<template>
  <button @click="toggleTheme" class="theme-toggle-button">
    Переключить тему
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

onMounted(() => {
  if (localStorage.getItem("theme") === "dark") {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
</script>

<style scoped>
.theme-toggle-button {
  padding: 8px 16px;
  border-radius: 9999px;
  background-color: var(--primary);
  color: white;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s;
}

.theme-toggle-button:hover {
  background-color: var(--hover-color);
  transform: scale(1.05);
}
</style>
