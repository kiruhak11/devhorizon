<template>
  <NuxtLayout name="default">
    <div class="about-container">
      <h1 class="about-title">О сайте</h1>
      <p class="about-text">
        Это проект, который я создал, чтобы помочь людям в их жизни. Я хочу,
        чтобы люди могли найти ответы на свои вопросы, общаться с другими
        людьми, которые имеют похожие интересы, и развиваться как личности.
      </p>

      <h2 class="about-admins-title">Администраторы</h2>
      <ul class="about-admins-list">
        <UiButton
          v-for="admin in admins"
          :key="admin.id"
          class="admin-item"
          :to="`/usersprofile/${admin.id}`"
        >
          <a>{{ admin.firstName }} {{ admin.lastName }}</a>
          <a :href="`https://t.me/${admin.telegramId}`" class="telegram-link"
            >@{{ admin.telegramId }}</a
          >
        </UiButton>
      </ul>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import axios from "axios";

let users: any[] = [];
const admins: any[] = [];
// Вызываем функцию для получения пользователей
try {
  const response = await axios.get("/api/users");
  users = response.data;
  admins.push(...users.filter((user) => user.isAdmin));
} catch (error) {
  console.error(error);
}
</script>

<style scoped lang="scss">
.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-title {
  font-size: 2rem;
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 15px;
}

.about-text {
  font-size: 1.2rem;
  text-align: justify;
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 25px;
}

.about-admins-title {
  font-size: 1.5rem;
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 15px;
}

.about-admins-list {
  list-style: none;
  padding: 0;
  display: flex;

  width: 100%;
  flex-direction: column;
  gap: 15px;

  .admin-item {
    display: flex;
    justify-content: space-between;
    height: 50px;
    width: 100%;
    align-items: center;
    background-color: var(--color-background);
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: var(-color-shadow);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    a {
      text-decoration: none;
      color: var(--color-text);
      font-weight: bold;
      &:hover {
        color: var(--color-accent);
      }
    }

    .telegram-link {
      color: var(--color-text-light);
    }
  }
}
</style>
