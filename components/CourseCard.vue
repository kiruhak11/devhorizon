<template>
  <NuxtLink
    :to="`/course/${course.id}`"
    class="subscription-card"
    :class="`subscription-card__${course.theme}`"
  >
    <div class="card-content">
      <h3 class="subscription-title">{{ course.title }}</h3>
      <p class="subscription-price">{{ course.price }}</p>
      <p class="subscription-description">{{ course.description }}</p>
    </div>
    <div class="card-overlay"></div>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(145deg, #f9f9fb, #ffffff);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  min-height: 300px;
  min-width: 280px;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #8bc34a, #ff9800, #f44336, #490702);
    border-radius: inherit;
    padding: 2px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: 1;
    transition: opacity 0.4s ease;
    opacity: 0;
  }

  &:hover::before {
    opacity: 1;
  }

  .card-content {
    position: relative;
    z-index: 2;

    .subscription-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .subscription-price {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--color-primary);
    }

    .subscription-description {
      font-size: 1rem;
      color: var(--color-text-secondary);
    }
  }

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    z-index: 0;
    transition: opacity 0.4s ease;
    opacity: 0;
  }

  &:hover .card-overlay {
    opacity: 1;
  }
}
</style>
