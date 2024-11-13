<template>
  <div class="layout-container">
    <TheHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
// Этот скрипт можно оставить пустым, если не требуется дополнительная логика
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
}

.main-content {
  flex-grow: 1;
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1200px; // или любое другое ограничение по ширине
}

@media screen and (min-width: 640px) {
  .main-content {
    padding: 0 24px;
  }
}

@media screen and (min-width: 1024px) {
  .main-content {
    padding: 0 32px;
  }
}
</style>
