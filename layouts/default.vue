<template>
  <div>
    <TheHeader v-if="!isMobile" />
    <HamburgerMenu v-else />
    <main>
      <slot></slot>

      <TheFooter v-if="isMobile" />
    </main>

    <TheFooter v-if="!isMobile" />
  </div>
</template>
<script setup lang="ts">
const { isMobile } = useDevice();
</script>
<style lang="scss">
main {
  height: 100vh;
}
</style>
