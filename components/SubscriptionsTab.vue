<template>
  <div class="tab-content">
    <Card
      v-for="item in subscriptionItems"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :description="item.description"
      :price="item.price"
      :type="item.type"
      :effect="item.effect"
    />
  </div>
</template>

<script setup lang="ts">
import Card from "~/components/Card.vue";
import { storeItems } from "~/data/store";

const subscriptionItems = storeItems.filter(
  (item) => item.type === "subscription"
);
</script>

<style scoped lang="scss">
.tab-content {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
