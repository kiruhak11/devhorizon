<template>
  <button class="reward-btn">
    <span class="IconContainer">
      <IconReward2 />
      <IconReward />
      <span class="coin"></span>
    </span>
  </button>
</template>
<script lang="ts" setup>
const { isMobile } = useDevice();
</script>

<style lang="scss" scoped>
/* From Uiverse.io by vinodjangid07 */
.reward-btn {
  width: 40px;
  height: 40px;
  background-color: var(--color-header-background);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
}
.IconContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.IconContainer svg {
  width: 40%;
  z-index: 3;
}
.box-top {
  transition: all 0.3s;
}
.text {
  width: 70px;
  height: 100%;
  font-size: 13px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 600;
}
.reward-btn:hover .IconContainer .box-top {
  transform: translateY(-5px);
}
.reward-btn:hover {
  background-color: var(--color-shadow);
}
.reward-btn:hover .coin {
  transform: translateY(-5px);
  transition-delay: 0.2s;
}
.coin {
  width: 25%;
  height: 25%;
  background-color: #e4d61a;
  position: absolute;
  border-radius: 50%;
  transition: all 0.3s;
  z-index: 1;
  border: 2px solid #ffe956;
  margin-top: 4px;
}
</style>
