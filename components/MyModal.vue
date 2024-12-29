<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h2 class="modal-title">{{ modalTitle }}</h2>
        <button class="modal-close" @click="closeModal">×</button>
      </header>
      <div class="modal-body">
        <p>{{ modalText }}</p>
      </div>
      <footer class="modal-footer">
        <UiButton class="full" @click="handleButtonClick">
          {{ modalButtonText }}
        </UiButton>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modalTitle: {
    type: String,
    default: "Заголовок",
  },
  modalText: {
    type: String,
    default: "Основной текст",
  },
  modalButtonText: {
    type: String,
    default: "Закрыть",
  },
  onButtonClick: {
    type: Function,
    default: null,
  },
});

const closeModal = () => {
  const [, close] = useFrogModal();
  close();
};

const handleButtonClick = () => {
  if (typeof props.onButtonClick === "function") {
    props.onButtonClick();
  }
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-shadow);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 12px;
  box-shadow: 0 10px 20px var(--color-shadow);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-header {
  background: var(--color-grad-banner);
  color: var(--color-header-text);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-background);
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-header-text);
  transition: color 0.2s;
  
  color: var(--color-background);
}

.modal-close:hover {
  color: var(--color-danger);
}

.modal-body {
  padding: 20px;
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.modal-footer {
  padding: 16px;
  text-align: right;
  border-top: 1px solid var(--color-border);
}


.modal-button:hover {
  background: var(--color-button-hover);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
