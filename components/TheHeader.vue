<template>
  <header class="container header">
    <nav class="nav container">
      <NuxtLink to="/" class="logo"> DevHorizon </NuxtLink>

      <div class="nav-links">
        <NuxtLink to="/" class="nav-link" exact-active-class="active-link">
          Главная
        </NuxtLink>

        <NuxtLink
          to="/course"
          class="nav-link"
          exact-active-class="active-link"
        >
          Курсы
        </NuxtLink>
        <NuxtLink
          v-if="!userStore.user"
          to="/login"
          class="nav-link"
          exact-active-class="active-link"
        >
          Войти
        </NuxtLink>
        <NuxtLink
          v-else
          to="/profile"
          class="nav-link"
          exact-active-class="active-link"
        >
          {{ userStore.user.firstName + " " + userStore.user.lastName }}
        </NuxtLink>
        <div v-if="userStore.user" :class="giftStatusClass">
          <Reward @click="getPresent"> Получить подарок </Reward>
        </div>
        <Switcher class="switcher" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const getPresent = () => {
  const currentDate = new Date();

  if (!userStore.user.gift || new Date(userStore.user.gift) < currentDate) {
    userStore.user.gift = new Date(
      currentDate.setUTCHours(currentDate.getUTCHours() + 24)
    );
    userStore.user.coins += 10;
    userStore.user.lives += 3;
    userStore.user.mana += 30;

    userStore.openModal(
      "Подарок получен",
      "Вы получили 10 монет, 3 жизни и 30 маны"
    );
    userStore.updateUserDataOnServer(false);
  } else {
    const nextGiftTime = new Date(userStore.user.gift).toLocaleString();
    userStore.openModal(
      "Подарок не доступен",
      `Подарок доступен ${nextGiftTime}`
    );
  }
};

const giftStatusClass = computed(() => {
  const currentDate = new Date();
  return new Date(userStore.user.gift) < currentDate || !userStore.user.gift
    ? "gift-button-wrapper available"
    : "gift-button-wrapper not-available";
});
</script>

<style scoped lang="scss">
.switcher {
  margin-top: 1px;
}
.header {
  background: var(--color-header-background);
  color: white;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px var(--color-shadow);
  padding: 24px 32px;
  border-radius: 0 0 24px 24px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: white;
  flex: 1;
}

.nav-link {
  font-size: 16px;
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
  &:hover {
    color: #fbbf24;
  }
}

.nav-link.active-link {
  color: #fbbf24;
}

.gift-button-wrapper {
  border-radius: 24px;
  &.available {
    border: 2px solid var(--color-success);
    box-shadow: 0 0 8px var(--color-success);
  }

  &.not-available {
    border: 2px solid var(--color-danger);
    box-shadow: 0 0 8px var(--color-danger);
  }
}

.reset-gift-btn {
  margin-top: 10px;

  UiButton {
    background-color: #fbbf24;
    color: #fff;
    &:hover {
      background-color: #f59e0b;
    }
  }
}
</style>
