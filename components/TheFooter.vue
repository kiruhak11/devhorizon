<template>
  <footer class="container footer">
    <div class="footer-content">
      <p class="footer-text">© 2024 DevHorizon. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup>
// Логика компонента (если нужно)
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-header-background); /* Градиентный фон */
  color: white;
  position: sticky;
  z-index: 10;
  box-shadow: 0 -4px 6px var(--color-shadow);
  padding: 24px 32px;
  border-radius: 24px 24px 0 0;
}

.footer-text {
  font-weight: 600; /* Эмулирует font-semibold */
  @media (max-width: 768px) {
    font-size: 14px;
  }
}
</style>
