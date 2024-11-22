<template>
  <NuxtLayout>
    <div class="container">
      <h3 class="profile-title">Ваш профиль</h3>

      <nav class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'dashboard' }"
          @click="setActiveTab('dashboard')"
        >
          Личный кабинет
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'settings' }"
          @click="setActiveTab('settings')"
        >
          Настройки профиля
        </button>
      </nav>

      <transition :name="transitionName" mode="out-in">
        <div :key="activeTab">
          <DashboardTab v-if="activeTab === 'dashboard'" />
          <SettingsTab v-if="activeTab === 'settings'" />
        </div>
      </transition>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
const router = useRouter();
const activeTab = ref("dashboard");
const userStore = useUserStore();
const setActiveTab = (tab: string) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab;
  }
};
const transitionName = computed(() => {
  return activeTab.value === "dashboard"
    ? "slide-fade-left"
    : "slide-fade-right";
});
onMounted(() => {
  if (!userStore.user) router.push("/");
});
</script>
<style scoped lang="scss">
.container {
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.profile-title {
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

.slide-fade-left-enter,
.slide-fade-left-leave-to,
.slide-fade-right-enter,
.slide-fade-right-leave-to {
  opacity: 0;
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
