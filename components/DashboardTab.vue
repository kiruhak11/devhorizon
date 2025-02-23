<template>
  <div class="dashboard">
    <h3 class="tab-title">Личный кабинет</h3>
    <div class="dashboard-cards" v-if="userStore.user">
      <div class="card">
        <p class="card-title">Кошелек</p>
        <p class="card-value">
          {{ userStore.user.coins.toLocaleString("ru-RU") }} ₽
        </p>

        <p class="card-detail">Используя нашего телеграм бота</p>
        <UiButton class="btn btn-small" @click="openModal">
          Пополнить
        </UiButton>
      </div>
      <div class="card">
        <p class="card-title">Оставшиеся жизни</p>
        <p class="card-value">{{ userStore.user.lives }}</p>
        <UiButton class="btn btn-small" to="/shop"> Магазин </UiButton>
      </div>
      <div class="card">
        <p class="card-title">Мана</p>
        <p class="card-value">{{ userStore.user.mana }}</p>
        <UiButton class="btn btn-small" to="/shop"> Магазин </UiButton>
      </div>
      <div class="card">
        <p class="card-title">Подписка</p>
        <p class="card-value">
          {{ userStore.userSubscription() }}
        </p>
        <div v-if="remainingTime != 'Срок истёк'" class="card-detail">
          <p>Осталось: {{ remainingTime }}</p>
          <UiButton class="btn btn-small" to="/shop"> Обновить </UiButton>
        </div>
        <div v-else class="card-detail">
          <p>{{ remainingTime }}</p>
          <UiButton class="btn btn-small" @click="renewSubscription">
            Продлить
          </UiButton>
        </div>
      </div>
      <div class="card" v-if="userStore.user.isAdmin">
        <p class="card-title">Статус</p>
        <p class="card-value">Админ</p>
        <p class="card-detail">Доступ к админ панели</p>
        <UiButton class="btn btn-small" to="/admin"> Перейти </UiButton>
      </div>
    </div>

    <!-- Прогресс по курсам -->
    <div class="courses">
      <h4 class="courses-title">Прогресс по курсам</h4>
      <ul class="course-list">
        <li
          v-for="(course, index) in userStore.courses"
          :key="course.id"
          class="course-item"
        >
          <div class="course-header" @click="toggleProgress(index)">
            <h5 class="course-name">{{ course.title }}</h5>
            <span class="progress-percent"
              >{{ getCourseProgress(course.id) }}%</span
            >
          </div>
          <transition name="fade">
            <div v-show="activeCourse === index" class="course-progress-detail">
              <p>Прогресс: {{ getCourseProgress(course.id) }}%</p>
              <div class="progress-bar">
                <div
                  class="progress-bar-fill"
                  :style="{
                    width: getCourseProgress(course.id) + '%',
                    backgroundColor: getProgressBarColor(
                      getCourseProgress(course.id)
                    ),
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

<script setup lang="ts">
const userStore = useUserStore();

const getCourseProgress = (courseId: number): number => {
  const courseProgress = userStore.progress.find(
    (item: { courseId: number }) => item.courseId === courseId
  );
  return courseProgress ? courseProgress.progress : 0;
};
const remainingTime = computed(() => {
  if (!userStore.subscription?.end) return "Неизвестно";

  const endDate = new Date(userStore.subscription.end);
  const now = new Date();

  if (endDate <= now) return "Срок истёк";

  const diff = endDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let result = "";
  if (days > 0) result += `${days} дн. `;
  if (hours > 0 || days > 0) result += `${hours} ч. `;
  result += `${minutes} мин.`;

  return result;
});

// Массив с курсами и прогрессом

// Функция для покупки маны

// Состояние текущего открытого курса
const activeCourse = ref<number | null>(null);

// Функция для переключения курса
const toggleProgress = (index: number) => {
  activeCourse.value = activeCourse.value === index ? null : index;
};

// Функция для определения цвета прогресс-бара
const getProgressBarColor = (progress: number): string => {
  if (progress < 30) return "red"; // Красный
  if (progress >= 30 && progress <= 60) return "orange"; // Оранжевый
  return "green"; // Зеленый
};

// Функция для продления подписки
const renewSubscription = () => {
  if (userStore.user.coins < countSubscriptionPrice()) {
    userStore.openModal(
      "Ошибка",
      "Недостаточно средств на счету. Пополните кошелек."
    );
    return;
  }

  userStore.openModal(
    "Продление подписки",
    `Вы действительно хотите продлить подписку за ${countSubscriptionPrice()} ₽?`,
    "Продлить",
    () => {
      if (new Date(userStore.subscription.end) >= new Date(Date.now())) {
        const currentEndDate = new Date(userStore.subscription.end);
        currentEndDate.setMonth(currentEndDate.getMonth() + 1);
        userStore.subscription.end = currentEndDate;
        userStore.user.coins -= countSubscriptionPrice();
      } else {
        userStore.subscription.end = new Date(Date.now());
        userStore.subscription.end.setMonth(
          userStore.subscription.end.getMonth() + 1
        );
        userStore.user.coins -= countSubscriptionPrice();
      }
      userStore.updateUserDataOnServer(false);
    }
  );
};
const countSubscriptionPrice = () => {
  return userStore.courses[userStore.subscription.type - 1].price;
};
const openModal = () => {
  userStore.openModal(
    "Пополнить кошелек",
    'Чтобы пополнить кошелек, нажмите кнопку "Пополнить", вас переведет на нашего телеграм бота, который поможет вам пополнить кошелек.',
    "Пополнить",
    openTelegramBot
  );
};
const openTelegramBot = () => {
  const botUrl = "https://t.me/devhorizon_bot";
  window.open(botUrl, "_blank");
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
  align-items: center;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 6px var(--color-shadow);
  transition: transform 0.2s ease-in-out;

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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 0.875rem;
    color: var(--color-text-light);
    margin-top: 8px;
  }

  .btn-small {
    margin-top: auto;
    padding: 8px 16px;
    font-size: 14px;
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
