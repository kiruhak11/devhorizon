<template>
  <div class="auth-container">
    <NuxtParticles
      id="tsparticles"
      :options="particlesOptions"
      @load="onLoad"
    />

    <div class="auth-box">
      <h2 class="auth-title">Добро пожаловать в DevHorizon</h2>

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
import { ref, computed } from "vue";
import { useColorMode } from "@vueuse/core";

const isLogin = ref(true);
const email = ref("");
const password = ref("");
const username = ref("");

// Получаем текущую тему
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

// Опции для частиц, зависящие от темы
const particlesOptions = computed(() => {
  return isDark.value
    ? {
        particles: {
          color: { value: "#ffffff" },
          opacity: { value: 0.5 },
          size: { value: 3 },
          move: { speed: 1 },
          number: { value: 100 },
        },
      }
    : {
        particles: {
          color: { value: "#ffdd57" },
          opacity: { value: 0.7 },
          size: { value: 3 },
          move: { speed: 0.5 },
          number: { value: 80 },
        },
      };
});
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
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.auth-box {
  position: relative;
  z-index: 10;
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
</style>
