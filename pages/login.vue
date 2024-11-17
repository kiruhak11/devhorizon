<template>
  <NuxtLayout name="auth">
    <div class="auth-container">
      <NuxtParticles
        v-if="isShowParticles"
        id="tsparticles"
        :options="particlesOptions"
        @load="onLoad"
      />
      <div :class="['bg-overlay', { dark: isDark }]"></div>
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
        <form v-if="isLogin" @submit="handleLogin">
          <div class="input-group">
            <label for="telegram_id">Login</label>
            <input
              type="text"
              id="telegram_id"
              v-model="telegramId"
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

        <form v-if="!isLogin">
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
          <button type="submit" class="submit-button">
            Зарегистрироваться
          </button>
        </form>
        <div class="auth-box__back">
          <ButtonBack />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
//@ts-ignore
import { Container } from "tsparticles-engine";
import axios from "axios";

import { useRouter } from "vue-router";

const isLogin = ref(true);
const telegramId = ref("");
const password = ref("");
const username = ref("");
const router = useRouter();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const isShowParticles = ref(true);
const particlesOptions = computed(() => {
  return {
    fullScreen: { enable: true, zIndex: -1 },
    particles: {
      color: { value: isDark.value ? "#a3a3a3" : "#333" },
      number: { value: 150 },
      shape: { type: "circle" },
      opacity: { value: 0.8 },
      size: { value: 3 },
      move: { enable: true, direction: "bottom", speed: 1 },
    },
  };
});
const handleLogin = async (event: { preventDefault: () => void }) => {
  event.preventDefault();

  try {
    const response = await axios.post("/api/login", {
      telegramId: telegramId.value,
      password: password.value,
    });

    if (response.data.message.includes("Login successful")) {
      const user = useUserStore();
      console.log();
      user.setUser(Object.fromEntries(Object.values(response.data.user))); // Сохраняем пользователя в хранилище
      router.push("/profile"); // Перенаправляем на страницу профиля
    } else {
      console.error("Login failed:", response.data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const onLoad = (container: Container) => {
  container.pause();
  setTimeout(() => container.play(), 1);
};

watch(
  () => colorMode.value,
  () => {
    isShowParticles.value = false;
    setTimeout(() => {
      isShowParticles.value = true;
    }, 100);
  }
);
</script>

<style scoped lang="scss">
.auth-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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
  &__back {
    position: absolute;
    top: 10px;
    left: 10px;
  }
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

.bg-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: var(--color-blur);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(50px);
  z-index: -2;
}
</style>
