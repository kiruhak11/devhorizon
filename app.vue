<template>
  <NuxtPage />
</template>

<style lang="scss" src="~/assets/styles/index.scss"></style>
<script setup lang="ts">
onMounted(() => {
  const userStore = useUserStore();
  userStore.loadUserFromLocalStorage();
});
</script>
