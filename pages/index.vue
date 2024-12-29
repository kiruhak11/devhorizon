<template>
  <NuxtLayout class="container" name="default">
    <div class="homepage">
      <!-- Header Section -->
      <section class="header">
        <div class="header-left">
          <div class="header-content">
            <h1 class="brand">DevHorizon —</h1>
            <p class="description">
              Это ваш надежный проводник в мире разработки. Мы помогаем
              начинающим и опытным разработчикам достичь мастерства в
              программировании и создавать крутые проекты.
            </p>
            <div class="auth-buttons">
              <UiButton theme="accent" to="/login">
                Войти или создать аккаунт
              </UiButton>
              <!-- Кнопка "Перейти" с проверкой на существование курса -->
              <UiButton
                theme="primary-rev"
                v-if="currentCourse"
                :to="`course/${currentCourse.id}`"
              >
                Перейти
              </UiButton>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="slider">
            <div
              class="course"
              v-for="(course, index) in visibleCourses"
              :key="course.id"
              :class="{ active: index === 0, next: index === 1 }"
            >
              <div class="course-card">
                <h3>{{ course.title }}</h3>
                <p>{{ course.description }}</p>
              </div>
            </div>

            <!-- Стрелочки для переключения -->
            <div class="slider-controls">
              <button
                class="prev-btn"
                @click="prevCourse"
                v-if="userStore.courses.length > 1"
              >
                &#8592;
                <!-- Стрелочка влево -->
              </button>
              <button
                class="next-btn"
                @click="nextCourse"
                v-if="userStore.courses.length > 1"
              >
                &#8594;
                <!-- Стрелочка вправо -->
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Новые пользователи -->
      <section class="new-users-container">
        <div class="new-users">
          <h3 class="section-title-new-users">Новые пользователи</h3>
          <ul class="user-list">
            <UiButton
              :to="`/usersprofile/${user.id}`"
              class="user full"
              v-for="user in latestUsers"
              :key="user.id"
              @mouseover="hoveredUser = user.id"
              @mouseleave="hoveredUser = null"
            >
              <IconProfile
                :class="{ 'icon-hovered': hoveredUser === user.id }"
              />
              {{ user.firstName }}
            </UiButton>
          </ul>
        </div>
      </section>
    </div>
    <section class="courses">
      <h2 class="section-title">Наши курсы</h2>
      <div class="courses-grid">
        <CourseCard
          v-for="course in userStore.courses"
          :key="course.id"
          :course="course"
        />
      </div>
    </section>

    <section class="courses admin">
      <h2 class="section-title">Написать админу</h2>
      <div class="courses-grid">
        <input v-model="name" type="text" placeholder="Ваше имя" />
        <input v-model="email" type="email" placeholder="Ваш email" />
        <textarea v-model="message" placeholder="Ваше сообщение"></textarea>
        <UiButton theme="accent-rev" @click="sendMessage">Отправить</UiButton>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const name = ref("");
const email = ref("");
const message = ref("");
const hoveredUser = ref(null);
// Функция для отправки сообщения админу
const sendMessage = async () => {
  if (!name.value || !email.value || !message.value) {
    userStore.openModal("Ошибка", "Пожалуйста, заполните все поля.");
    return;
  }

  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value,
        tgId: userStore.user.telegramId,
        Id: userStore.user.id,
        type: "admin",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      userStore.openModal(
        "Успех",
        `Сообщение: \n${message.value}\nуспешно отправлено`
      );
      name.value = "";
      email.value = "";
      message.value = "";
    } else {
      userStore.openModal(
        "Ошибка",
        `Произошла ошибка при отправке сообщения: ${data.error}`
      );
    }
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
    userStore.openModal("Ошибка", "Произошла ошибка при отправке сообщения");
  }
};

const userStore = useUserStore();

// Текущий индекс курса
const currentIndex = ref(0);

// Получение текущего курса
const currentCourse = computed(
  () => userStore.courses[currentIndex.value] || null
);

// Отображаемые курсы: текущий и следующий
const visibleCourses = computed(() => {
  if (userStore.courses.length === 0) return [];
  return [
    userStore.courses[currentIndex.value],
    userStore.courses[(currentIndex.value + 1) % userStore.courses.length],
  ];
});

// Переключение на следующий курс
const nextCourse = () => {
  currentIndex.value = (currentIndex.value + 1) % userStore.courses.length;
};

// Переключение на предыдущий курс
const prevCourse = () => {
  currentIndex.value =
    (currentIndex.value - 1 + userStore.courses.length) %
    userStore.courses.length;
};

userStore.fetchUsers();

// Вычисляем список двух последних пользователей
const latestUsers = computed(() => {
  return [...userStore.users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2);
});
</script>

<style lang="scss" scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 40px 20px;
  background: var(--color-grad-banner);
  color: #fff;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.header-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
}

.header-right {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 24px;
}

.header-content {
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
  }
}

.auth-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin-top: 20px;
}

/* Слайдер */
.slider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
  background-color: var(--color-background);
  overflow: hidden;
  position: relative;
}

.course {
  position: absolute;
  width: 80%;
  text-align: center;
  transition: all 0.5s ease;
}

.course.active {
  transform: translateX(0);
  opacity: 1;
  z-index: 2;
}

.course.next {
  transform: translateX(50%);
  opacity: 0.5;
  z-index: 1;
}

.course-card {
  color: var(--color-text);
  padding: 20px;
  background-color: var(--color-background);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.course h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.course p {
  font-size: 1rem;
  line-height: 1.4;
}

/* Кнопки "Следующий" и "Предыдущий" */
.slider-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  z-index: 5;
}
.prev-btn {
  padding-right: 4px;
}
.next-btn {
  padding-left: 4px;
}
.prev-btn,
.next-btn {
  padding-bottom: 5px;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  z-index: 10;
  border-radius: 1px, 0px, 1px, 0px;
  width: 50px;
  height: 50px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 15;
}

.prev-btn {
  border-radius: 0 50% 50% 0 / 50%;
}
.next-btn {
  border-radius: 50% 0 0 50% / 50%;
}
.prev-btn,
.next-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-grad-banner); /* Применяем градиентный фон хедера */
}

/* Новые пользователи */
.new-users {
  margin-top: -30px;
  background-color: var(--color-background);
  padding: 20px 15px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  position: absolute;
  margin-left: auto;
  transform: translateY(10px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  right: 0;
  &-container {
    display: flex;
    justify-content: flex-end;
    position: relative;
  }
}

.section-title-new-users {
  color: var(--color-text);
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.user-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
}
.user-list .user:hover {
  background-color: var(--color-text);
}

.user-list .user:hover .icon-hovered {
  background-color: var(--color-background);
  padding: 1%;
  border-radius: 50%;
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background-color: var(--color-background);
  border-radius: 10px;
  font-size: 1rem;
}
.courses {
  background-color: var(--color-grad-banner);
  padding: 32px 32px;
  border-radius: 20px;
  margin-top: 140px;
}
.admin {
  margin-bottom: 100px;
}
.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #f2f2f2;
  text-align: center;
  margin-bottom: 2rem;
}

.courses-grid {
  display: flex;
  flex-wrap: wrap; /* Позволяет карточкам переноситься на новую строку */
  justify-content: center; /* Центровка карточек */
  gap: 20px; /* Расстояние между карточками */
  input {
    border-radius: 12px;
    border: 1.5px solid var(--color-border);
    padding: 8px;
    background-color: var(--color-background);
    &:focus {
      box-shadow: 0 0 25px var(--color-border);
    }
  }
  textarea {
    border-radius: 12px;
    background-color: var(--color-background);
    border: 1.5px solid var(--color-border);
    padding: 8px;
    height: 100px;
    min-height: 60px;
    &:focus {
      box-shadow: 0 0 25px var(--color-border);
    }
  }
}

.courses-grid > * {
  flex: 1 1 calc(25% - 20px); /* Карточки занимают 25% ширины с учетом отступов */
  max-width: calc(25% - 20px); /* Максимальная ширина карточки */
  min-width: 280px; /* Минимальная ширина для узких экранов */
  box-sizing: border-box; /* Учет паддингов в ширине */
}

@media (max-width: 1200px) {
  .courses-grid > * {
    flex: 1 1 calc(33.33% - 20px); /* 3 карточки в строке на средних экранах */
    max-width: calc(33.33% - 20px);
  }
}

@media (max-width: 768px) {
  .courses-grid > * {
    flex: 1 1 calc(50% - 20px); /* 2 карточки в строке на узких экранах */
    max-width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .courses-grid > * {
    flex: 1 1 100%; /* 1 карточка на очень узких экранах */
    max-width: 100%;
  }
}
</style>
