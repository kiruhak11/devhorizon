<template>
  <div class="course-card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ title: string; description: string }>();
</script>

<style scoped lang="scss">
.course-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  max-width: 300px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin-bottom: 10px;
  }
}
</style>
