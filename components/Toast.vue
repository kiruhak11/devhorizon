<template>
  <div class="toast-container untouchable">
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :class="[
        'toast',
        `toast-${toast.type}`,
        { 'toast-closing': toast.isClosing },
      ]"
      :style="{ animationDuration: toast.duration + 'ms' }"
      @click="handleToastClick(toast)"
    >
      <div class="toast-icon">
        <component :is="getIconComponent(toast.type)" />
      </div>
      <div class="toast-message">
        {{ toast.message }}
      </div>
      <div
        class="progress-bar"
        :style="{ animationDuration: toast.duration + 'ms' }"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toastStore } from "~/stores/toastStore";
import SuccessIcon from "~/components/icon/toasts/success.vue";
import ErrorIcon from "~/components/icon/toasts/error.vue";
import InfoIcon from "~/components/icon/toasts/info.vue";
import WarningIcon from "~/components/icon/toasts/warning.vue";

const handleToastClick = (toast: { id: number }) => {
  toastStore.updateToastStatus(toast.id, true);
};

const getIconComponent = (type: "success" | "error" | "info" | "warning") => {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "error":
      return ErrorIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    default:
      return InfoIcon;
  }
};
</script>
<style scoped lang="scss">
.toast {
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
  min-width: 250px;
  max-width: 400px;
  animation: In 10s ease-out 0s 1 normal forwards;
  cursor: pointer;
  &-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 1000;
  }
  &-icon {
    margin-right: 10px;
    display: flex;
    align-items: center;
  }
  &-message {
    max-width: 300px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  &-success {
    background-color: #4caf50;
  }
  &-error {
    background-color: #f44336;
  }
  &-info {
    background-color: #2196f3;
  }
  &-warning {
    background-color: #ff9800;
  }
  &-closing {
    animation: Out 0.1s ease-out 1s 1 normal forwards;
  }
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #fff;
  border-radius: 2px;
  animation: progressBar linear forwards;
  animation-duration: var(--toast-duration, 2.7s);
}

@keyframes In {
  0% {
    animation-timing-function: ease-in;
    transform: translateX(400px);
  }
  10% {
    animation-timing-function: ease-in;
    transform: translateX(-10px);
  }
  15% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }
  30% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  40% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  50% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  90% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  100% {
    animation-timing-function: ease-out;
    transform: translateX(400px);
  }
}

@keyframes Out {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(4000px);
  }
}

@keyframes progressBar {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
