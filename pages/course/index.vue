<template>
  <NuxtLayout>
    <div class="courses-container">
      <h2 class="heading">Наши курсы</h2>
      <div class="courses-grid">
        <CourseCard
          v-for="course in userStore.courses"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const userStore = useUserStore();
</script>

<style scoped lang="scss">
.courses-container {
  padding: 4rem 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

.heading {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 2rem;
}

.courses-grid {
  display: flex;
  gap: 32px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.course-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .course-card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .course-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }

  .course-description {
    font-size: 1rem;
    color: var(--color-text);
  }
}
</style>
