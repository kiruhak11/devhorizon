<template>
  <NuxtLink
    :to="`/course/${course.id}`"
    class="subscription-card"
    :class="`subscription-card__${course.theme}`"
  >
    <h3 class="subscription-title">{{ course.title }}</h3>
    <p class="subscription-price">{{ course.price }}</p>
    <p class="subscription-description">{{ course.description }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  course: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.subscription-card {
  background-color: var(--color-background);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  flex: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &__easy {
    border: 3px solid #8bc34a;
    .subscription-title {
      color: #8bc34a;
    }
  }

  &__medium {
    border: 3px solid #ff9800;
    .subscription-title {
      color: #ff9800;
    }
  }

  &__hard {
    border: 3px solid #f44336;
    .subscription-title {
      color: #f44336;
    }
  }
  &__hardPlus {
    border: 3px solid #490702;
    .subscription-title {
      color: #490702;
    }
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .subscription-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .subscription-price {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-primary);
  }

  .subscription-description {
    font-size: 1rem;
    color: var(--color-text);
  }
}
</style>
