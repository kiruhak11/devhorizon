<template>
  <footer class="footer">
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
  background: var(--color-header-background);
  color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 16px 0;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-text {
  font-weight: 600; /* Эмулирует font-semibold */
}
</style>
