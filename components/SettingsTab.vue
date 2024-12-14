<template>
  <div>
    <h3 class="tab-title">Настройки профиля</h3>
    <div v-if="userStore.user">
      <div class="form-group">
        <label for="name">Имя</label>
        <input v-model="name" id="name" type="text" placeholder="Ваше имя" />
      </div>
      <div class="form-group">
        <label for="lastname">Фамилия</label>
        <input
          v-model="lastname"
          id="lastname"
          type="text"
          placeholder="Ваш lastname"
        />
      </div>

      <form class="form-group">
        <input
          type="text"
          name="username"
          id="username"
          style="display: none"
          autocomplete="username"
        />
        <label for="password">Password</label>
        <input
          v-model="password"
          id="password"
          :type="passwordVisible ? 'text' : 'password'"
          :placeholder="passwordEmpty ? 'Создайте пароль!' : 'Изменить пароль'"
          autocomplete="new-password"
        />
      </form>

      <div class="form-group" v-if="isAdmin">
        <label for="subscription">subscription</label>
        <input
          v-model="PushSubscription"
          id="subscription"
          type="text"
          :placeholder="`Подписка: ${userStore.subscription.type}`"
        />
      </div>
      <div class="form-group" v-if="isAdmin">
        <label for="coins">coins</label>
        <input
          v-model="PushCoins"
          id="Pushcoins"
          type="text"
          :placeholder="`coins: ${userStore.user.coins}`"
        />
      </div>
      <div class="form-group" v-if="isAdmin">
        <label for="lives">lives</label>
        <input
          v-model="PushLives"
          id="PushLives"
          type="text"
          :placeholder="`Lives: ${userStore.user.lives}`"
        />
      </div>
      <div class="form-group">
        <UiButton class="full" @click="resetGiftTimer"
          >Сбросить таймер подарка</UiButton
        >
      </div>
      <div class="btns">
        <UiButton :class="isMobile ? 'full' : ''" @click="updateProfile"
          >Сохранить изменения</UiButton
        >
        <UiButton
          :class="isMobile ? 'full' : ''"
          theme="danger"
          @click="deleteAccount"
        >
          Выйти
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const { isMobile } = useDevice();
const userStore = useUserStore();
const router = useRouter();
const isAdmin = userStore.subscription.type >= 5;
const name = ref<string>(userStore.user?.firstName || "");
const lastname = ref<string>(userStore.user?.lastName || "");
const password = ref<string>();
const passwordVisible = ref<boolean>(false);
const passwordEmpty = ref<boolean>(false);
const PushSubscription = ref<number>(userStore.subscription.type || 0);
const PushCoins = ref<number>(userStore.user.coins || 0);
const PushLives = ref<number>(userStore.user.lives || 0);

const updateProfile = () => {
  if (userStore.user) {
    userStore.user.firstName = name.value;
    userStore.user.lastName = lastname.value;
    if (password.value != null) {
      userStore.user.password = password.value;
    }
    if (Number(PushLives.value)) {
      userStore.user.lives = Number(PushLives.value);
    } else {
      userStore.openModal(
        `Ошибка`,
        `Lives должны быть числом, а не ${PushLives.value}`
      );
      return;
    }
    if (Number(PushSubscription.value)) {
      userStore.subscription.type = Number(PushSubscription.value);
    } else {
      userStore.openModal(
        `Ошибка`,
        `Подписка должна быть числом от 0 до 3, а не ${PushSubscription.value}`
      );
      return;
    }
    if (Number(PushCoins.value)) {
      userStore.user.coins = Number(PushCoins.value);
    } else {
      userStore.openModal(
        `Ошибка`,
        `coins должны быть числом, а не ${PushCoins.value}`
      );
      return;
    }
    if (password.value != null) {
      userStore.updateUserDataOnServer(true);
    } else {
      userStore.updateUserDataOnServer(false);
    }
    handlePassword();
    userStore.openModal(
      `Обновление данных`,
      `
    Ваши данные обновлены успешно:
    Имя: ${userStore.user.firstName}
    Фамилия: ${userStore.user.lastName}
    Подписка: ${userStore.subscription.type}
    coins: ${userStore.user.coins}
    lives: ${userStore.user.lives}
    ${password.value ? "Пароль был успешно обновлён: " + password.value : ""}
  `.trim()
    );
  }
};
const resetGiftTimer = () => {
  userStore.user.gift = new Date(); // Сбрасываем подарок на 24 часа вперед
  userStore.updateUserDataOnServer(false); // Обновляем данные на сервере
};
const deleteAccount = () => {
  userStore.clearUser();
  router.push("/");
};
const handlePassword = () => {
  if (!userStore.user?.password) {
    passwordVisible.value = true;
    passwordEmpty.value = true;
  } else {
    passwordVisible.value = false;
    passwordEmpty.value = false;
  }
};
onMounted(() => {
  handlePassword();
});
</script>

<style scoped lang="scss">
.tab-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--color-text-dark);
  }

  input {
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 1rem;
    color: var(--color-text);
  }
}

.btns {
  display: flex;
  gap: 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
</style>
