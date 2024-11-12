<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ progress: number }>();
</script>

<style scoped lang="scss">
.progress-bar {
  background-color: #ddd;
  border-radius: 10px;
  height: 20px;
  width: 100%;
  margin: 10px 0;
  overflow: hidden;

  .progress {
    background-color: #0070f3;
    height: 100%;
    transition: width 0.3s;
  }
}
</style>
