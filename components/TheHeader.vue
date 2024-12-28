<template>
  <header class="container header">
    <nav class="nav container">
      <!-- Логотип -->
      <NuxtLink to="/" class="logo">
        <IconLogo alt="DevHorizon Logo" class="logo-image" />
        <span class="logo-text">DevHorizon</span>
      </NuxtLink>

      <!-- Навигация -->
      <div class="nav-links">
        <NuxtLink to="/" class="nav-link" exact-active-class="active-link">
          Главная
        </NuxtLink>
        <NuxtLink to="/shop" class="nav-link" exact-active-class="active-link">
          Магазин
        </NuxtLink>
        <NuxtLink
          to="/course"
          class="nav-link"
          exact-active-class="active-link"
        >
          Курсы
        </NuxtLink>
        <NuxtLink to="/about" class="nav-link" exact-active-class="active-link">
          О нас
        </NuxtLink>
      </div>

      <!-- Кнопка входа -->
      <div class="auth-button">
        <UiButton
          v-if="!userStore.user"
          to="/login"
          class="mini"
          theme="accent"
        >
          Войти / Зарегистрироваться
        </UiButton>
        <UiButton class="profile" to="/profile" v-else>
          <span class="profile-content">
            <IconProfile class="profile-icon" />
            <div class="profile-menu">
              <span class="profile-menu-fl">
                {{ userStore.user.firstName + " " + userStore.user.lastName }}
              </span>
              <span class="profile-menu-coins">
                Баланс: {{ userStore.user.coins.toLocaleString("ru-RU") }} ₽
              </span>
            </div>
          </span>
          <span class="profile-hover">Профиль &#8594;</span>
        </UiButton>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const userStore = useUserStore();
</script>

<style scoped lang="scss">
.header {
  color: var(--color-header-text);
  top: 0;
  z-index: 10;
  padding: 32px 32px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  .logo-image {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--color-header-text);
  }
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;

  .nav-link {
    font-size: 16px;
    text-decoration: none;
    color: var(--color-header-text);
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-active-link);
    }
  }

  .nav-link.active-link {
    color: var(--color-active-link);
  }
}

.auth-button {
  .profile {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 8px;
    padding: 8px 16px;
    border: 1.5px solid var(--color-text);
    border-radius: 8px;
    overflow: hidden;
    background-color: transparent;

    &:hover {
      background-color: var(--color-text);
    }
    &-menu {
      display: flex;
      align-items: start;
      flex-direction: column;
      &-fl {
        font-size: 16px;
        font-weight: 500;
      }
      &-coins {
        font-size: 14px;
        color: var(--color-text-light);
      }
    }
    .profile-content {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    .profile-hover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: 500;
      color: var(--color-background);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      .profile-content {
        opacity: 0;
      }

      .profile-hover {
        opacity: 1;
      }
    }
  }
}
</style>
