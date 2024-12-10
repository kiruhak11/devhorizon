<template>
  <NuxtLayout name="auth">
    <div class="auth-container">
      <NuxtParticles
        v-if="isShowParticles"
        id="tsparticles"
        :options="ParticlesOptions"
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
              autocomplete="username"
              v-model="telegramId"
              class="input-field"
              required
            />
          </div>
          <div class="input-group">
            <label for="password_login">Пароль</label>
            <input
              type="password"
              id="password_login"
              v-model="password_login"
              class="input-field"
              autocomplete="current-password"
              required
            />
          </div>
          <button type="submit" class="submit-button">Войти</button>
          <div class="submit-telegram">
            <TelegramLoginWidget
              telegram-login="devhorizon_bot"
              @callback="testCallback_login"
            />
          </div>
        </form>

        <form v-if="!isLogin">
          <div class="input-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="input-field"
              autocomplete="current-password"
              required
            />
          </div>
          <div v-if="password" class="submit-telegram">
            <TelegramLoginWidget
              telegram-login="devhorizon_bot"
              @callback="testCallback_register"
            />
          </div>
        </form>
        <a class="error-message">{{ error }}</a>
        <div class="auth-box__back"></div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
//@ts-ignore
import { Container } from "tsparticles-engine";
import axios from "axios";
import { useRouter } from "vue-router";
import { useColorMode } from "@vueuse/core";
useSeoMeta({
  title: "Авторизация",
});

const isLogin = ref(true);
const telegramId = ref("");
const password = ref("");
const password_login = ref("");
const error = ref("");
const router = useRouter();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const userStore = useUserStore();

const isShowParticles = ref(true);
const ParticlesOptions = computed((): {} => {
  return {
    particles: {
      color: { value: isDark.value ? "#fff" : "#333" },
      move: {
        direction: "bottom",
        enable: true,
        outModes: "out",
        speed: 2,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 400,
      },
      opacity: {
        value: 0.7,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: 10,
      },
      wobble: {
        enable: true,
        distance: 10,
        speed: 10,
      },
      zIndex: {
        value: { min: 0, max: 100 },
      },
    },
  };
});

const handleLogin = async (event: { preventDefault: () => void }) => {
  event.preventDefault();
  error.value = ""; // Сброс ошибок

  try {
    // Отправляем данные на сервер для логина
    const response = await axios.post("/api/login", {
      telegramId: telegramId.value,
      password: password_login.value,
      type: "password",
      method: "login",
      tguser: null, // Можно передавать данные Telegram пользователя, если нужно
    });

    if (response.data.message.includes("Login successful")) {
      // Сохраняем данные пользователя в хранилище Pinia
      const userStore = useUserStore();
      userStore.setUser(response.data.user, response.data.subscription); // Сохраняем пользователя в хранилище

      // Перенаправляем на страницу профиля
      router.push("/profile");

      toast("Успешная авторизация!", "success", 3000);
    } else {
      error.value = "Login failed: " + response.data.message; // В случае ошибки логина
    }
  } catch (er) {
    error.value = "Неверный пароль";
  }
};
const encodeBase64 = (str: string) => {
  try {
    // Используем TextEncoder для работы с Unicode символами
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(str);

    // Преобразуем результат в base64
    let base64String = "";
    for (let i = 0; i < uint8Array.length; i++) {
      base64String += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(base64String);
  } catch (e) {
    console.error("Error encoding to base64", e);
    return "";
  }
};

const testCallback_register = async (user: any) => {
  console.log("a", user);
  error.value = "";
  try {
    // Преобразуем имя пользователя в безопасный для base64 формат
    const encodedUserName = encodeBase64(user.username);

    const response = await axios.post("/api/login", {
      telegramId: user.id,
      password: password.value,
      type: "telegram",
      method: "register",
      tguser: { ...user, username: encodedUserName }, // отправляем закодированное имя
    });

    if (response.data.message.includes("User already exists")) {
      error.value = "Такой пользователь уже существует.";
    }
    if (response.data.message.includes("Login successful")) {
      const userStore = useUserStore();
      userStore.setUser(response.data.user, response.data.subscription);
      router.push("/profile"); // Перенаправляем на страницу профиля
    } else {
      error.value = "Login failed:" + response.data.message;
    }
  } catch (er) {
    error.value = "Login failed:" + er;
  }
};

const testCallback_login = async (user: any) => {
  error.value = "";
  try {
    const response = await axios.post("/api/login", {
      telegramId: user.id,
      password: password.value,
      type: "telegram",
      method: "login",
      tguser: user,
    });
    if (response.data.message.includes("Login successful")) {
      const user = useUserStore();
      user.setUser(response.data.user, response.data.subscription); // Сохраняем пользователя в хранилище

      router.push("/profile"); // Перенаправляем на страницу профиля
    } else if (response.data.message.includes("Invalid credentials")) {
      toast("Аккаунт не существует!", "warning", 3000);
      isLogin.value = false;
    } else {
      error.value = "Login failed:" + response.data.message;
    }
  } catch (er) {
    error.value = "Login failed:" + er;
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
onMounted(() => {
  if (userStore.user) router.push("/profile");
});
</script>

<style scoped lang="scss">
.auth-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 10px;
}
@media (max-width: 768px) {
  .auth-box {
    max-width: 100%;
    padding: 15px;
  }
  .auth-title {
    font-size: 20px;
  }
  .toggle-button {
    font-size: 16px;
    padding: 8px 16px;
  }
  .submit-button {
    font-size: 14px;
  }
}
.bg-overlay {
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
    filter: blur(40px);
  }
}

.error-message {
  display: flex;
  justify-content: center;
  color: var(--color-danger);
  text-align: center;
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

.submit {
  &-button {
    width: 100%;
    padding: 12px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.01);
      background-color: #2980b9;
    }
  }
  &-telegram {
    display: flex;
    justify-content: center;
    margin-top: 20px;
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
