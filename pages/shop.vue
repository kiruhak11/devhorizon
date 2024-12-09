<template>
  <NuxtLayout name="default">
    <div class="container shop-container">
      <div class="profile">
        <h3 class="profile-title">Магазин</h3>
        <div v-if="userStore.user" class="profile-switcher">
          <p>Жизни: {{ userStore.user.lives }}</p>
          <p>Мана: {{ userStore.user.mana }}</p>
        </div>
        <div v-if="userStore.user" class="profile-subscription">
          <p>
            Подписка:
            {{
              userStore.subscription.type === 1
                ? "Базовая"
                : userStore.subscription.type === 2
                ? "Премиум"
                : userStore.subscription.type === 3
                ? "Эксперт"
                : userStore.subscription.type === 4
                ? "Эксперт+"
                : userStore.subscription.type || "Без подписки"
            }}
          </p>
          <p>Действительна до: {{ formattedEndDate }}</p>
        </div>
      </div>
      <nav class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'subscriptions' }"
          @click="setActiveTab('subscriptions')"
        >
          Подписки
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'resources' }"
          @click="setActiveTab('resources')"
        >
          Жизни и мана
        </button>
      </nav>

      <transition :name="transitionName" mode="out-in">
        <div :key="activeTab">
          <SubscriptionsTab v-if="activeTab === 'subscriptions'" />
          <ResourcesTab v-if="activeTab === 'resources'" />
        </div>
      </transition>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const activeTab = ref("subscriptions");

const formattedEndDate = computed(() => {
  const date = new Date(userStore.subscription.end);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const setActiveTab = (tab: string) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab;
  }
};
const transitionName = computed(() => {
  return activeTab.value === "subscriptions"
    ? "slide-fade-left"
    : "slide-fade-right";
});
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  justify-self: center;
  align-items: center;
  gap: 24px;
  &-title {
    font-size: 1.75rem;
    color: var(--color-primary);
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
  }
  &-switcher {
    position: absolute;
    top: 24px;
    right: 24px;
    p {
      color: var(--color-primary);
    }
  }
  &-subscription {
    position: absolute;
    top: 24px;
    left: 24px;
    p {
      color: var(--color-primary);
    }
  }
}
.shop-container {
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.shop-title {
  font-size: 1.75rem;
  color: var(--color-primary);
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;

  .tab-button {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid var(--color-primary);
    background-color: var(--color-white);
    color: var(--color-primary);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background-color: var(--color-primary);
      color: white;
    }
    &:hover {
      background-color: var(--color-primary);
      color: white;
    }
  }
}

.slide-fade-left-enter-active,
.slide-fade-left-leave-active,
.slide-fade-right-enter-active,
.slide-fade-right-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-left-enter {
  transform: translateX(-100%);
}

.slide-fade-left-leave-to {
  transform: translateX(100%);
}

.slide-fade-right-enter {
  transform: translateX(100%);
}

.slide-fade-right-leave-to {
  transform: translateX(-100%);
}
</style>
