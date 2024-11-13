<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- Заголовок -->
      <h2 class="auth-title">Добро пожаловать в DevHorizon</h2>

      <!-- Переключатель между логином и регистрацией -->
      <div class="auth-toggle">
        <button
          :class="{ active: isLogin }"
          @click="isLogin = true"
          class="toggle-button"
        >
          Войти
        </button>
        <button
          :class="{ active: !isLogin }"
          @click="isLogin = false"
          class="toggle-button"
        >
          Зарегистрироваться
        </button>
      </div>

      <!-- Форма логина -->
      <form v-if="isLogin" @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="input-field"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="input-field"
            required
          />
        </div>
        <button type="submit" class="submit-button">Войти</button>
      </form>

      <!-- Форма регистрации -->
      <form v-if="!isLogin" @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="input-field"
            required
          />
        </div>
        <div class="input-group">
          <label for="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="input-field"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="input-field"
            required
          />
        </div>
        <button type="submit" class="submit-button">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isLogin = ref(true); // Переключатель: true — форма входа, false — форма регистрации
const email = ref("");
const password = ref("");
const username = ref("");

const handleLogin = () => {
  console.log("Login with", email.value, password.value);
  // Логика для входа
};

const handleRegister = () => {
  console.log("Register with", email.value, username.value, password.value);
  // Логика для регистрации
};
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .auth-box {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    padding: 20px 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .auth-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--color-primary);
  }

  .auth-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .toggle-button {
      background-color: transparent;
      border: none;
      padding: 10px 20px;
      font-size: 18px;
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 0 10px;

      &.active {
        color: #3498db;
        border-bottom: 2px solid #3498db;
      }

      &:hover {
        color: #3498db;
      }
    }
  }

  .input-group {
    margin-bottom: 15px;

    label {
      font-size: 14px;
      color: var(--color-text);
      margin-bottom: 5px;
      display: block;
    }

    .input-field {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid var(--color-primary);
      background-color: var(--color-background);
      color: var(--color-text);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #3498db;
      }
    }
  }

  .submit-button {
    width: 100%;
    padding: 12px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2980b9;
    }
  }
}
</style>
