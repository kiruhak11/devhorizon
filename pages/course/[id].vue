<template>
  <NuxtLayout name="default">
    <div class="container">
      <h2 class="course-title">{{ course?.title }}</h2>
      <p class="course-description">{{ course?.description }}</p>

      <div v-if="!isCourseStarted">
        <div v-if="isCourseActive">
          <UiButton class="full" @click="startCourse">Начать</UiButton>
        </div>

        <div v-else>
          <p class="course-alert">
            У вас не куплен данный курс. Пожалуйста, купите его за
            <span class="course-price">{{ course?.price }}₽</span>.
          </p>
          <UiButton class="full" @click="userStore.buyCourse(course)">
            Купить
          </UiButton>
        </div>

        <NuxtLink to="/course" class="back-link">← Назад к курсам</NuxtLink>
      </div>

      <transition name="fade">
        <coursesCourse1 v-if="isCourseStarted" class="course-content" />
      </transition>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const userStore = useUserStore();
const route = useRoute();
const isCourseStarted = ref(false);

const courseId = computed(() => Number(route.params.id));

const course = computed(() =>
  userStore.courses.find((c: { id: number }) => c.id === courseId.value)
);

const isCourseActive = computed(() => {
  if (course.value && userStore.subscription?.type) {
    return Number(userStore.subscription.type) >= course.value.id;
  }
  return false;
});

const startCourse = () => {
  isCourseStarted.value = true;
};

watch(
  () => route.params.id,
  () => {
    userStore.loadCoursesFromLocalStorage();
    isCourseStarted.value = false;
  }
);
</script>

<style scoped lang="scss">
.container {
  margin: 40px auto;
  padding: 40px 20px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 24px var(--color-shadow);
  backdrop-filter: blur(12px);
  color: var(--color-text);
  text-align: center;
}

.course-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 16px;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.course-description {
  font-size: 1.125rem;
  color: var(--color-text);
  margin-bottom: 30px;
  line-height: 1.6;
}

.course-alert {
  font-size: 1rem;
  color: var(--color-danger);
  margin-bottom: 20px;
}

.course-price {
  font-weight: 600;
  color: var(--color-primary);
}

.back-link {
  display: block;
  margin-top: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.course-content {
  margin-top: 20px;
  text-align: left;
}
</style>
