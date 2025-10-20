<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Product, STORAGE_KEY } from './types';
import ProductCard from './components/ProductCard.vue';
import AddProductModal from './components/AddProductModal.vue';

// State
const products = ref<Product[]>([]);
const isModalOpen = ref(false);

// Load products from localStorage
const loadProducts = (): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      products.value = JSON.parse(stored) as Product[];
    } catch (error) {
      console.error('Error loading products:', error);
      products.value = [];
    }
  }
};

// Save products to localStorage
const saveProducts = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value));
};

// Open add product modal
const openModal = (): void => {
  isModalOpen.value = true;
};

// Close modal
const closeModal = (): void => {
  isModalOpen.value = false;
};

// Handle add product
const handleAddProduct = (product: Product): void => {
  products.value.push(product);
  saveProducts();
  closeModal();

  // Check if price is already at or below target
  if (product.price <= product.targetPrice) {
    showNotification(`${product.name} is already at your target price!`);
  }
};

// View product (opens URL in new tab)
const viewProduct = (product: Product): void => {
  if (product.url) {
    window.open(product.url, '_blank');
  }
};

// Delete product
const deleteProduct = (productId: number): void => {
  if (confirm('Are you sure you want to remove this product?')) {
    products.value = products.value.filter((p) => p.id !== productId);
    saveProducts();
  }
};

// Show notification
const showNotification = (message: string): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration): void => {
      registration.showNotification('NearBuy Alert', {
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      });
    });
  }
};

// Initialize app
onMounted(() => {
  loadProducts();
});
</script>

<template>
  <header>
    <h1>NearBuy</h1>
    <p class="tagline">Track products, catch sales</p>
  </header>

  <main>
    <section id="products-section">
      <div class="section-header">
        <h2>My Products</h2>
        <button id="add-product-btn" class="btn-primary" @click="openModal">
          + Add Product
        </button>
      </div>

      <div id="products-list" class="products-grid">
        <div v-if="products.length === 0" class="empty-state">
          <p>No products tracked yet</p>
          <p class="hint">Add a product to get started!</p>
        </div>

        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @view="viewProduct"
          @delete="deleteProduct"
        />
      </div>
    </section>

    <AddProductModal
      :is-open="isModalOpen"
      @close="closeModal"
      @add-product="handleAddProduct"
    />
  </main>

  <footer>
    <p>&copy; 2025 NearBuy</p>
  </footer>
</template>
