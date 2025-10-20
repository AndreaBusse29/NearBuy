<script setup lang="ts">
import { Product } from '../types';

// Props
interface Props {
  product: Product;
}

defineProps<Props>();

// Emits
const emit = defineEmits<{
  view: [product: Product];
  delete: [productId: number];
}>();
</script>

<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p class="product-store">{{ product.store }}</p>

    <div class="product-prices">
      <div class="price current">
        <span class="price-label">Current Price</span>
        <span class="price-value">${{ product.price.toFixed(2) }}</span>
      </div>
      <div class="price target">
        <span class="price-label">Target Price</span>
        <span class="price-value">${{ product.targetPrice.toFixed(2) }}</span>
      </div>
    </div>

    <div class="product-actions">
      <button @click="emit('view', product)">View</button>
      <button class="btn-delete" @click="emit('delete', product.id)">
        Delete
      </button>
    </div>
  </div>
</template>
