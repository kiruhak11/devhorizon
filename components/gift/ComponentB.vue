<template>
  <div class="component-a">Компонент B</div>
</template>

<script setup lang="ts">
// Простой компонент без логики
</script>

<style scoped>
.component-a {
  background: linear-gradient(145deg, #4e51ff, #ff6a00);
  color: white;
  padding: 20px;
  border-radius: 12px;
  font-size: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.component-a:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
