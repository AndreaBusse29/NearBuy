<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';

// Props
interface Props {
  isOpen: boolean;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showCloseButton: true,
  closeOnBackdropClick: true,
  closeOnEsc: true,
});

// Emits
const emit = defineEmits<{
  close: [];
}>();

// Refs
const modalRef = ref<HTMLElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);

// Store the element that opened the modal
const storeFocus = (): void => {
  previousActiveElement.value = document.activeElement as HTMLElement;
};

// Restore focus to the element that opened the modal
const restoreFocus = (): void => {
  if (previousActiveElement.value && previousActiveElement.value.focus) {
    previousActiveElement.value.focus();
  }
};

// Move focus to first focusable element in modal
const focusFirstElement = async (): Promise<void> => {
  await nextTick();
  if (!modalRef.value) return;

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

// Trap focus within modal
const trapFocus = (e: KeyboardEvent): void => {
  if (!props.isOpen || !modalRef.value) return;
  if (e.key !== 'Tab') return;

  const focusableElements = Array.from(
    modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
};

// Handle modal background click
const handleModalClick = (e: MouseEvent): void => {
  if (props.closeOnBackdropClick && e.target === e.currentTarget) {
    emit('close');
  }
};

// Handle escape key
const handleEscapeKey = (e: KeyboardEvent): void => {
  if (props.closeOnEsc && e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

// Watch for modal open/close
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    storeFocus();
    await focusFirstElement();
  } else {
    restoreFocus();
  }
});

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('keydown', trapFocus);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  document.removeEventListener('keydown', trapFocus);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
        @click="handleModalClick"
      >
        <div ref="modalRef" class="modal-content">
          <div v-if="title || showCloseButton || $slots.header" class="modal-header">
            <h3 v-if="title" id="modal-title">{{ title }}</h3>
            <slot name="header" />
            <button
              v-if="showCloseButton"
              class="close-modal"
              aria-label="Close modal"
              @click="emit('close')"
            >
              &times;
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-content,
  .modal-leave-active .modal-content {
    transition: none !important;
  }

  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: none;
  }
}

/* Body scroll lock when modal is open */
.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}
</style>
