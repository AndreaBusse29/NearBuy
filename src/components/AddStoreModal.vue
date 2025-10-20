<script setup lang="ts">
import { ref, watch } from 'vue';
import { Shop } from '../types';
import BaseModal from './BaseModal.vue';

// Props
interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  'add-store': [store: Shop];
}>();

// Form data
const storeName = ref('');
const storeUrl = ref('');

// Validation errors
const errors = ref<Record<string, string>>({});

// Reset form when modal closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

// Reset form
const resetForm = (): void => {
  storeName.value = '';
  storeUrl.value = '';
  errors.value = {};
};

// Validate form
const validateForm = (): boolean => {
  errors.value = {};

  if (!storeName.value.trim()) {
    errors.value.storeName = 'Store name is required';
  }

  if (!storeUrl.value.trim()) {
    errors.value.storeUrl = 'Store URL is required';
  } else if (!/^https?:\/\/.+/.test(storeUrl.value)) {
    errors.value.storeUrl = 'Please enter a valid URL (must start with http:// or https://)';
  }

  return Object.keys(errors.value).length === 0;
};

// Handle form submission
const handleSubmit = (): void => {
  if (!validateForm()) return;

  const store: Shop = {
    id: Date.now(),
    name: storeName.value.trim(),
    url: storeUrl.value.trim(),
    dateAdded: new Date().toISOString(),
  };

  emit('add-store', store);
};
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    title="Add Store"
    @close="emit('close')"
  >
    <form id="add-store-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="store-name">
          Store Name
          <span class="required" aria-label="required">*</span>
        </label>
        <input
          id="store-name"
          v-model="storeName"
          type="text"
          placeholder="e.g., Amazon, Best Buy"
          required
          :aria-invalid="errors.storeName ? 'true' : 'false'"
          :aria-describedby="errors.storeName ? 'store-name-error' : undefined"
        />
        <span
          v-if="errors.storeName"
          id="store-name-error"
          class="error-message"
          role="alert"
        >
          {{ errors.storeName }}
        </span>
      </div>

      <div class="form-group">
        <label for="store-url">
          Store Website URL
          <span class="required" aria-label="required">*</span>
        </label>
        <input
          id="store-url"
          v-model="storeUrl"
          type="url"
          placeholder="https://www.example.com"
          required
          :aria-invalid="errors.storeUrl ? 'true' : 'false'"
          :aria-describedby="errors.storeUrl ? 'store-url-error' : undefined"
        />
        <span
          v-if="errors.storeUrl"
          id="store-url-error"
          class="error-message"
          role="alert"
        >
          {{ errors.storeUrl }}
        </span>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button type="submit" class="btn-primary">Add Store</button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.required {
  color: var(--danger-color);
  margin-left: 0.25rem;
}

.error-message {
  display: block;
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
