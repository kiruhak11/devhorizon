<template>
  <div class="toast-container">
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      :style="{
        animationDuration: toast.duration + 'ms',
      }"
      @animationend="removeToast(toast.id)"
    >
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

const removeToast = (id: number) => {
  toastStore.removeToast(id);
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.toast {
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-width: 250px;
  max-width: 400px;
  animation: In 6s ease-out 0s 1 normal forwards;
}

.toast-message {
  max-width: 300px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.toast-success {
  background-color: #4caf50;
}

.toast-error {
  background-color: #f44336;
}

.toast-info {
  background-color: #2196f3;
}

.toast-warning {
  background-color: #ff9800;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #fff;
  border-radius: 2px;
  animation: progressBar linear forwards;
  animation-duration: var(
    --toast-duration,
    2.7s
  ); /* Прогресс-бар синхронизируется с длительностью */
}
@keyframes In {
  0% {
    animation-timing-function: ease-in;
    transform: translateX(400px);
  }
  10% {
    animation-timing-function: ease-in;
    transform: translateX(150px);
  }
  20% {
    animation-timing-function: ease-in;
    transform: translateX(20px);
  }

  30% {
    animation-timing-function: ease-in;
    transform: translateX(6.5px);
  }

  40% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  50% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  60% {
    animation-timing-function: ease-in;
    transform: translateX(0px);
  }

  70% {
    animation-timing-function: ease-in;
    transform: translateX(6.5px);
  }

  80% {
    animation-timing-function: ease-in;
    transform: translateX(20px);
  }

  90% {
    animation-timing-function: ease-in;
    transform: translateX(150px);
  }

  100% {
    animation-timing-function: ease-out;
    transform: translateX(400px);
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
