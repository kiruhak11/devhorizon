<template>
  <div class="dashboard">
    <h3 class="tab-title">Личный кабинет</h3>
    <div class="dashboard-cards">
      <div class="card">
        <p class="card-title">Кошелек</p>
        <p class="card-value">{{ wallet }} монет</p>
        <UiButton class="btn-small" @click="renewSubscription">
          Пополнить баланс
        </UiButton>
      </div>
      <div class="card">
        <p class="card-title">Оставшиеся жизни</p>
        <p class="card-value">{{ lives }}</p>
        <UiButton class="btn-small" @click="renewSubscription">
          Пополнить жизни
        </UiButton>
      </div>
      <div class="card">
        <p class="card-title">Мана</p>
        <p class="card-value">{{ mana }}</p>
        <UiButton class="btn-small" @click="renewSubscription">
          пополнить ману
        </UiButton>
      </div>
      <div class="card">
        <p class="card-title">Подписка</p>
        <p class="card-value">{{ subscriptionType }}</p>
        <p class="card-detail">Осталось: {{ subscriptionEnd }}</p>
        <UiButton class="btn-small" @click="renewSubscription">
          Продлить
        </UiButton>
      </div>
    </div>

    <!-- Прогресс по курсам -->
    <div class="courses">
      <h4 class="courses-title">Прогресс по курсам</h4>
      <ul class="course-list">
        <li
          v-for="(course, index) in userCourses"
          :key="index"
          class="course-item"
        >
          <div class="course-header" @click="toggleProgress(index)">
            <h5 class="course-name">{{ course.title }}</h5>
            <span class="progress-percent">{{ course.progress }}%</span>
          </div>
          <transition name="fade">
            <div v-show="activeCourse === index" class="course-progress-detail">
              <p>Прогресс: {{ course.progress }}%</p>
              <div class="progress-bar">
                <div
                  class="progress-bar-fill"
                  :style="{
                    width: course.progress + '%',
                    backgroundColor: getProgressBarColor(course.progress),
                  }"
                ></div>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { userData } from "~/data/userData";
// Данные
const wallet = userData.wallet;
const lives = userData.lives;
const mana = userData.mana;
const subscriptionType = userData.subscriptionType;
const subscriptionEnd = userData.subscriptionEnd;
const userCourses = userData.userCourses;
// Текущее состояние открытой панели
const activeCourse = ref(null);

const toggleProgress = (index) => {
  activeCourse.value = activeCourse.value === index ? null : index;
};

// Функция для цвета прогресс-бара
const getProgressBarColor = (progress) => {
  if (progress < 30) return "red"; // Красный
  if (progress >= 30 && progress <= 60) return "orange"; // Оранжевый
  return "green"; // Зеленый
};

// Продление подписки (заглушка)
const renewSubscription = () => {
  alert("Подписка продлена!");
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tab-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: var(--color-primary);
  text-align: center;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }

  .card-title {
    font-size: 1rem;
    color: var(--color-text);
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--color-primary);
  }

  .card-detail {
    font-size: 0.875rem;
    color: var(--color-text-light);
    margin-top: 8px;
  }

  .btn-small {
    margin-top: 12px;
    padding: 8px 16px;
    font-size: 0.875rem;
  }
}

.courses {
  margin-top: 20px;
}

.courses-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.course-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.course-item {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: var(--color-bg-light);
  }
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .course-name {
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-primary);
  }

  .progress-percent {
    font-size: 1rem;
    color: var(--color-text);
  }
}

.course-progress-detail {
  margin-top: 12px;
  .progress-bar {
    background-color: var(--color-bg-light);
    border-radius: 50px;
    height: 8px;
    overflow: hidden;

    border: 1px solid var(--color-border);
  }

  .progress-bar-fill {
    height: 100%;
    transition: width 0.3s ease-in-out;
  }
}

/* Анимация для выпадающей панели */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
