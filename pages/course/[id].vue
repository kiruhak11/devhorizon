<template>
  <NuxtLayout name="default">
    <div class="course-container__id">
      <div class="course-header">
        <h2 class="course-title">{{ course?.title }}</h2>
        <p class="course-description">{{ course?.description }}</p>
      </div>

      <div v-if="!isCourseStarted">
        <div v-if="isCourseActive">
          <UiButton
            v-if="!isCourseUsed"
            class="start-button full"
            @click="startCourse"
          >
            Начать
          </UiButton>
          <UiButton
            v-if="isCourseUsed"
            class="start-button full"
            @click="continueCourse"
          >
            Продолжить за {{ courseId * 10 }} маны
          </UiButton>
        </div>
        <div v-else>
          <p class="course-alert">
            У вас не куплен данный курс. Пожалуйста, купите его за
            <span class="course-price">{{ course?.price }}₽</span>.
          </p>
          <UiButton
            class="buy-button full"
            @click="userStore.buyCourse(course)"
          >
            Купить
          </UiButton>
        </div>

        <NuxtLink to="/course" class="back-link">← Назад к курсам</NuxtLink>
      </div>

      <div class="question-mark" @click="showInfo">?</div>
      <transition name="fade">
        <coursesCourse1 v-if="isCourseStarted" class="course-content" />
      </transition>
      <div class="user-stats">
        <p>Жизни: {{ userStore.user.lives }}</p>
        <p>Мана: {{ userStore.user.mana }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

const userStore = useUserStore();
const route = useRoute();
const isCourseStarted = ref(false);
const isCourseUsed = ref(false);

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
const showInfo = () => {
  userStore.openModal(
    "Информация",
    `При каждом неправильном ответе будет отниматься одна жизнь. Когда жизни закончатся, курс начнется заново. Также каждый перезаход на страницу будет тратить ${
      courseId.value * 10
    } маны. Если маны нет, будут отниматься жизни.`
  );
};
const getCourseUsedStatus = (courseId: number) => {
  return localStorage.getItem(`isCourseUsed-${courseId}`) === "true";
};

const startCourse = () => {
  isCourseStarted.value = true;
  isCourseUsed.value = true;
  showInfo();
  localStorage.setItem(`isCourseUsed-${courseId.value}`, "true");
};
const continueCourse = () => {
  if (userStore.user.lives < 1) {
    userStore.openModal(
      "Ошибка",
      "Недостаточно жизней. Пожалуйста, покупите жизнь."
    );
    return;
  }
  if (userStore.user.mana < courseId.value * 10) {
    userStore.openModal(
      "Ошибка",
      "Недостаточно маны. Пожалуйста, покупите ману."
    );
  } else {
    isCourseStarted.value = true;
    userStore.user.mana -= courseId.value * 10;
    userStore.updateUserDataOnServer(false);
  }
};
watch(
  () => userStore.user.lives,
  () => {
    if (userStore.user.lives < 1) {
      isCourseStarted.value = false;
    }
  }
);
watch(
  () => route.params.id,
  () => {
    userStore.loadCoursesFromLocalStorage();
    isCourseStarted.value = false;
    isCourseUsed.value = getCourseUsedStatus(courseId.value);
  }
);

onMounted(() => {
  isCourseUsed.value = getCourseUsedStatus(courseId.value);
});
</script>

<style scoped lang="scss">
.course-container__id {
  margin: 40px auto;
  padding: 40px 20px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 24px var(--color-shadow);
  backdrop-filter: blur(12px);
  color: var(--color-text);
  text-align: center;
  max-width: 1000px;
  background-color: var(--color-background-light);
}

.course-header {
  margin-bottom: 30px;
}
.question-mark {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
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
.user-stats {
  margin-top: 20px;
  font-size: 1.125rem;
  color: var(--color-text);
  display: flex;
  justify-content: center;
  gap: 20px;
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

.start-button,
.buy-button {
  margin-top: 20px;
  padding: 12px 25px;
  font-size: 1.125rem;
  background: var(--color-primary);
  color: white;
  border-radius: 50px;
  transition: background 0.3s ease, transform 0.2s ease;
  width: 100%;
  cursor: pointer;
}

.start-button:hover,
.buy-button:hover {
  background: var(--color-primary-hover);
  transform: scale(1.01);
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
  margin-top: 30px;
  text-align: left;
  padding: 20px 0;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
