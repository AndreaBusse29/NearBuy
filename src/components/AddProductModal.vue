<script setup lang="ts">
import { ref, watch } from 'vue';
import { Product, Shop } from '../types';
import BaseModal from './BaseModal.vue';

// Props
interface Props {
  isOpen: boolean;
  stores: Shop[];
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  'add-product': [product: Product];
}>();

// Form data
const productName = ref('');
const productUrl = ref('');
const selectedStoreId = ref<number | null>(null);
const productPrice = ref<number | null>(null);
const targetPrice = ref<number | null>(null);

// Reset form when modal closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

// Reset form
const resetForm = (): void => {
  productName.value = '';
  productUrl.value = '';
  selectedStoreId.value = null;
  productPrice.value = null;
  targetPrice.value = null;
};

// Handle form submission
const handleSubmit = (): void => {
  if (!productPrice.value || !targetPrice.value || !selectedStoreId.value) return;

  // Find selected store
  const selectedStore = props.stores.find((s) => s.id === selectedStoreId.value);
  if (!selectedStore) return;

  const product: Product = {
    id: Date.now(),
    name: productName.value,
    url: productUrl.value,
    store: selectedStore.name,
    price: productPrice.value,
    targetPrice: targetPrice.value,
    dateAdded: new Date().toISOString(),
  };

  emit('add-product', product);
};
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    title="Add Product"
    @close="emit('close')"
  >
    <form id="add-product-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="product-name">Product Name</label>
        <input
          id="product-name"
          v-model="productName"
          type="text"
          required
        />
      </div>
      <div class="form-group">
        <label for="product-url">Product URL</label>
        <input
          id="product-url"
          v-model="productUrl"
          type="url"
          required
        />
      </div>
      <div class="form-group">
        <label for="product-store">
          Store
          <span class="required" aria-label="required">*</span>
        </label>
        <select
          id="product-store"
          v-model="selectedStoreId"
          required
          :aria-describedby="stores.length === 0 ? 'store-help-text' : undefined"
        >
          <option :value="null" disabled>Select a store</option>
          <option
            v-for="store in stores"
            :key="store.id"
            :value="store.id"
          >
            {{ store.name }}
          </option>
        </select>
        <p
          v-if="stores.length === 0"
          id="store-help-text"
          class="help-text"
        >
          No stores available. Please add a store first using the "+ Add Store" button.
        </p>
      </div>
      <div class="form-group">
        <label for="product-price">Current Price (€)</label>
        <input
          id="product-price"
          v-model.number="productPrice"
          type="number"
          step="0.01"
          required
        />
      </div>
      <div class="form-group">
        <label for="target-price">Target Price (€)</label>
        <input
          id="target-price"
          v-model.number="targetPrice"
          type="number"
          step="0.01"
          required
        />
      </div>
      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button type="submit" class="btn-primary">Add Product</button>
      </div>
    </form>
  </BaseModal>
</template>