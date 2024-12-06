<template>
  <header class="container header">
    <div class="hamburger-menu" @click="toggleMenu">
      <div class="hamburger-menu-text">
        <h1>DevHorizon</h1>
      </div>
      <div class="hamburger-menu-icon">
        <div class="bar" :class="{ open: isOpen }"></div>
        <div class="bar" :class="{ open: isOpen }"></div>
        <div class="bar" :class="{ open: isOpen }"></div>
      </div>
    </div>

    <nav
      :class="{ 'mobile-nav-open': isOpen }"
      class="mobile-nav"
      @click="toggleMenu"
    >
      <ul class="menu-list">
        <li class="menu-item">
          <NuxtLink to="/" class="nav-link" exact-active-class="active-link">
            Главная
          </NuxtLink>
        </li>
        <li class="menu-item">
          <NuxtLink
            to="/course"
            class="nav-link"
            exact-active-class="active-link"
          >
            Курсы
          </NuxtLink>
        </li>
        <li v-if="!userStore.user" class="menu-item">
          <NuxtLink
            to="/login"
            class="nav-link"
            exact-active-class="active-link"
          >
            Войти
          </NuxtLink>
        </li>
        <li v-else class="menu-item">
          <NuxtLink
            to="/profile"
            class="nav-link"
            exact-active-class="active-link"
          >
            {{ userStore.user.firstName + " " + userStore.user.lastName }}
          </NuxtLink>
        </li>
        <li class="menu-item">
          <div v-if="userStore.user" :class="giftStatusClass">
            <Reward @click="getPresent" />
            <p>Получить подарок</p>
          </div>
          <Switcher />
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const userStore = useUserStore();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

watch(isOpen, () => {
  if (isOpen.value) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove("no-scroll");
});

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
.header {
  background: var(--color-header-background);
  color: white;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px var(--color-shadow);
  padding: 24px 32px;
  border-radius: 0 0 24px 24px;

  h1 {
    font-size: 24px;
    font-weight: 600;
  }
}
.nav-link {
  font-size: 16px;
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
  &:hover {
    color: #fbbf24;
  }
  &.active-link {
    color: #fbbf24;
  }
}
.hamburger-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-icon {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    .bar {
      width: 26px;
      height: 3px;
      background-color: var(--color-text);
      margin: 4px;
      transition: all 0.3s ease;

      &.open:nth-child(1) {
        transform: rotate(45deg) translate(15px);
      }

      &.open:nth-child(2) {
        opacity: 0;
      }

      &.open:nth-child(3) {
        transform: rotate(-45deg) translate(15px);
      }
    }
  }
}

.mobile-nav {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-20px);
  transition: max-height 0.5s ease, opacity 0.5s ease, transform 0.5s ease;

  &-open {
    max-height: 500px;
    opacity: 1;
    transform: translateY(0);
  }

  .menu-list {
    list-style: none;
    padding: 16px;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .menu-item {
      font-size: 18px;
      text-align: center;
      width: 100%;
      padding: 8px 16px;
      border-radius: 8px;
      background: var(--color-background-light);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background 0.3s, box-shadow 0.3s;

      &:hover {
        background: var(--color-primary-light);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .icon {
        margin-right: 8px;
        font-size: 20px;
        vertical-align: middle;
      }
    }
  }
}
.gift-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 24px;
  margin: 8px 0;
  &.available {
    border: 2px solid var(--color-success);
    box-shadow: 0 0 8px var(--color-success);
  }

  &.not-available {
    border: 2px solid var(--color-danger);
    box-shadow: 0 0 8px var(--color-danger);
  }
}
</style>
