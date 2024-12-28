<template>
  <NuxtLayout class="container" name="default">
    <div v-if="user" class="user-profile">
      <section class="profile-header">
        <div class="profile-left">
          <h1 class="profile-title">Профиль пользователя</h1>
          <h2 class="user-name">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="user-id">ID: {{ user.telegramId }}</p>
          <div
            v-if="subscription && subscription.type >= 5"
            class="admin-badge"
          >
            <strong>ADMIN!</strong>
          </div>
        </div>
        <div class="profile-right">
          <img
            class="profile-avatar"
            src="https://via.placeholder.com/150"
            alt="User Avatar"
          />
        </div>
      </section>

      <section class="user-info">
        <p>
          <strong>Имя пользователя:</strong> {{ user.username || "Не указано" }}
        </p>
        <p><strong>Телефон:</strong> {{ user.phone || "Не указан" }}</p>
        <p>
          <strong>Дата регистрации:</strong>
          {{ new Date(user.createdAt).toLocaleDateString("ru-RU") }}
        </p>
      </section>

      <section class="user-stats">
        <div class="stats-item">
          <strong>Баланс:</strong>
          {{ user.coins.toLocaleString("ru-RU") }} &#8381;
        </div>
        <div class="stats-item"><strong>Жизни:</strong> {{ user.lives }}</div>
        <div class="stats-item"><strong>Мана:</strong> {{ user.mana }}</div>
      </section>

      <section v-if="subscription" class="user-subscription">
        <h3>Подписка:</h3>
        <p>
          <strong>Тип подписки:</strong>
          {{ getSubscriptionType(subscription.type) }}
        </p>
        <p>
          <strong>Дата окончания:</strong>
          {{ new Date(subscription.end).toLocaleDateString("ru-RU") }}
        </p>
      </section>

      <div v-else>Пользователь не имеет подписки</div>

      <section class="message-user">
        <h3>Написать пользователю</h3>
        <textarea
          v-model="message"
          class="message-textarea"
          placeholder="Введите ваше сообщение..."
        ></textarea>
        <UiButton @click="sendMessage" class="full">
          Отправть сообщение
        </UiButton>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { User, Subscription } from "@prisma/client";
import axios from "axios";

const userStore = useUserStore();
const message = ref("");
const route = useRoute();
const user = ref<null | User>(null);
const subscription = ref<null | Subscription>(null);
let users: User[] = [];
let subscriptions: Subscription[] = [];

const sendMessage = async () => {
  if (!message.value || !userStore.user) {
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
        name: userStore.user.firstName + " " + userStore.user.lastName,
        message: message.value,
        tgId: userStore.user.telegramId,
        Id: userStore.user.id,
        type: "user",
        toSandId: user.value?.telegramId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      userStore.openModal(
        "Успех",
        `Сообщение: \n${message.value}\nуспешно отправлено`
      );
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

onMounted(async () => {
  const userId = Number(route.params.id);
  try {
    const response = await axios.get("/api/users");
    users = response.data;
  } catch (error) {
    console.error(error);
  }
  user.value = users.find((u: { id: number }) => u.id === userId) || null;

  try {
    const response = await axios.get("/api/subscriptions");
    subscriptions = response.data;
  } catch (error) {
    console.error(error);
  }

  subscription.value =
    subscriptions.find((subscription: any) => subscription.userId === userId) ||
    null;
});

const getSubscriptionType = (type: number) => {
  if (type === 1) return "Базовая";
  if (type === 2) return "Премиум";
  if (type === 3) return "Эксперт";
  return type >= 4 ? "Эксперт+" : "Ошибка";
};
</script>

<style scoped lang="scss">
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #f4f7fc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.profile-left {
  flex: 1;
}

.profile-title {
  font-size: 2.5rem;
  color: var(--color-grad-banner);
}

.user-name {
  font-size: 1.8rem;
  margin-bottom: 10px;
}
.message-user {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  textarea {
    width: 100%;
    padding: 10px;
    border: 1.5px solid var(--color-border);
    border-radius: 12px;
    margin-bottom: 10px;
    resize: vertical;
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
}
.user-id {
  font-size: 1rem;
  color: #999;
}

.profile-right {
  flex: 0 0 150px;
}

.profile-avatar {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid var(--color-border);
}

.admin-badge {
  margin-top: 10px;
  color: #ff5733;
  font-weight: bold;
}

.user-info,
.user-stats,
.user-subscription {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-info p,
.user-stats div,
.user-subscription p {
  font-size: 1rem;
  color: var(--color-text-light);
}

.user-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stats-item {
  font-size: 1rem;
}

strong {
  font-weight: bold;
}
</style>
