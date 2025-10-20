<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Product, Shop, STORAGE_KEY, SHOPS_STORAGE_KEY } from './types';
import ProductCard from './components/ProductCard.vue';
import AddProductModal from './components/AddProductModal.vue';
import AddStoreModal from './components/AddStoreModal.vue';

// State
const products = ref<Product[]>([]);
const stores = ref<Shop[]>([]);
const isProductModalOpen = ref(false);
const isStoreModalOpen = ref(false);

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

// Load stores from localStorage
const loadStores = (): void => {
  const stored = localStorage.getItem(SHOPS_STORAGE_KEY);
  if (stored) {
    try {
      stores.value = JSON.parse(stored) as Shop[];
    } catch (error) {
      console.error('Error loading stores:', error);
      stores.value = [];
    }
  }
};

// Save stores to localStorage
const saveStores = (): void => {
  localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(stores.value));
};

// Open add product modal
const openProductModal = (): void => {
  isProductModalOpen.value = true;
};

// Close product modal
const closeProductModal = (): void => {
  isProductModalOpen.value = false;
};

// Open add store modal
const openStoreModal = (): void => {
  isStoreModalOpen.value = true;
};

// Close store modal
const closeStoreModal = (): void => {
  isStoreModalOpen.value = false;
};

// Handle add product
const handleAddProduct = (product: Product): void => {
  products.value.push(product);
  saveProducts();
  closeProductModal();

  // Check if price is already at or below target
  if (product.price <= product.targetPrice) {
    showNotification(`${product.name} is already at your target price!`);
  }
};

// Handle add store
const handleAddStore = (store: Shop): void => {
  stores.value.push(store);
  saveStores();
  closeStoreModal();
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
  loadStores();
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
        <div class="header-actions">
          <button
            id="add-store-btn"
            class="btn-secondary"
            @click="openStoreModal"
            aria-label="Add a new store"
          >
            + Add Store
          </button>
          <button
            id="add-product-btn"
            class="btn-primary"
            @click="openProductModal"
            aria-label="Add a new product to track"
          >
            + Add Product
          </button>
        </div>
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
      :is-open="isProductModalOpen"
      :stores="stores"
      @close="closeProductModal"
      @add-product="handleAddProduct"
    />

    <AddStoreModal
      :is-open="isStoreModalOpen"
      @close="closeStoreModal"
      @add-store="handleAddStore"
    />
  </main>

  <footer>
    <p>&copy; 2025 NearBuy</p>
  </footer>
</template>
