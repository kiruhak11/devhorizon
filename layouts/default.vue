<template>
  <div>
    <TheHeader />
    <main>
      <slot></slot>
    </main>
    <TheFooter />
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss">
main {
  height: 100vh;
}
</style>
