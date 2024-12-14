<template>
  <div>
    <TheHeader v-if="!isMobile" />
    <HamburgerMenu v-else />
    <main>
      <slot></slot>

      <div v-if="userStore.user" :class="giftStatusClass">
        <Reward @click="getPresent"> Получить подарок </Reward>
      </div>
      <!-- <TheFooter /> -->
    </main>
  </div>
</template>
<script setup lang="ts">
const { isMobile } = useDevice();
const userStore = useUserStore();
const getPresent = () => {
  const currentDate = new Date();

  if (!userStore.user.gift || new Date(userStore.user.gift) < currentDate) {
    userStore.user.gift = new Date(
      currentDate.setUTCHours(currentDate.getUTCHours() + 24)
    );

    userStore.openGiftModal();
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
<style lang="scss">
main {
  height: 100vh;
}
.gift-button-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  background-color: var(--color-background);
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  height: 64px;
  width: 64px;
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
