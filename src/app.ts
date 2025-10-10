// NearBuy - Main Application Logic
import { Product, DOMElements, STORAGE_KEY } from './types.js';

// State management
let products: Product[] = [];

// DOM Elements
let dom: DOMElements;

// Initialize app
document.addEventListener('DOMContentLoaded', (): void => {
  // Get DOM element references
  dom = {
    addProductBtn: document.getElementById('add-product-btn') as HTMLButtonElement,
    addProductModal: document.getElementById('add-product-modal') as HTMLElement,
    addProductForm: document.getElementById('add-product-form') as HTMLFormElement,
    cancelBtn: document.getElementById('cancel-btn') as HTMLButtonElement,
    closeModalBtn: document.querySelector('.close-modal') as HTMLElement,
    productsList: document.getElementById('products-list') as HTMLElement,
    productNameInput: document.getElementById('product-name') as HTMLInputElement,
    productUrlInput: document.getElementById('product-url') as HTMLInputElement,
    productStoreInput: document.getElementById('product-store') as HTMLInputElement,
    productPriceInput: document.getElementById('product-price') as HTMLInputElement,
    targetPriceInput: document.getElementById('target-price') as HTMLInputElement,
  };

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration: ServiceWorkerRegistration): void => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error: Error): void => {
        console.error('Service Worker registration failed:', error);
      });
  }

  // Load products from localStorage
  loadProducts();

  // Render products
  renderProducts();

  // Event listeners
  dom.addProductBtn.addEventListener('click', openModal);
  dom.cancelBtn.addEventListener('click', closeModal);
  dom.closeModalBtn.addEventListener('click', closeModal);
  dom.addProductForm.addEventListener('submit', handleAddProduct);

  // Close modal when clicking outside
  dom.addProductModal.addEventListener('click', (e: MouseEvent): void => {
    if (e.target === dom.addProductModal) {
      closeModal();
    }
  });

  // Request notification permission
  requestNotificationPermission();
});

// Load products from localStorage
function loadProducts(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      products = JSON.parse(stored) as Product[];
    } catch (error) {
      console.error('Error loading products:', error);
      products = [];
    }
  }
}

// Save products to localStorage
function saveProducts(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Render products to the page
function renderProducts(): void {
  if (products.length === 0) {
    dom.productsList.innerHTML = `
      <div class="empty-state">
        <p>No products tracked yet</p>
        <p class="hint">Add a product to get started!</p>
      </div>
    `;
    return;
  }

  dom.productsList.innerHTML = products
    .map(
      (product: Product, index: number): string => `
    <div class="product-card">
      <h3>${escapeHtml(product.name)}</h3>
      <p class="product-store">${escapeHtml(product.store)}</p>

      <div class="product-prices">
        <div class="price current">
          <span class="price-label">Current Price</span>
          <span class="price-value">$${product.price.toFixed(2)}</span>
        </div>
        <div class="price target">
          <span class="price-label">Target Price</span>
          <span class="price-value">$${product.targetPrice.toFixed(2)}</span>
        </div>
      </div>

      <div class="product-actions">
        <button onclick="window.viewProduct(${index})">View</button>
        <button class="btn-delete" onclick="window.deleteProduct(${index})">Delete</button>
      </div>
    </div>
  `
    )
    .join('');
}

// Open add product modal
function openModal(): void {
  dom.addProductModal.classList.remove('hidden');
  dom.addProductForm.reset();
}

// Close modal
function closeModal(): void {
  dom.addProductModal.classList.add('hidden');
}

// Handle add product form submission
function handleAddProduct(e: Event): void {
  e.preventDefault();

  const product: Product = {
    id: Date.now(),
    name: dom.productNameInput.value,
    url: dom.productUrlInput.value,
    store: dom.productStoreInput.value,
    price: parseFloat(dom.productPriceInput.value),
    targetPrice: parseFloat(dom.targetPriceInput.value),
    dateAdded: new Date().toISOString(),
  };

  products.push(product);
  saveProducts();
  renderProducts();
  closeModal();

  // Check if price is already at or below target
  if (product.price <= product.targetPrice) {
    showNotification(`${product.name} is already at your target price!`);
  }
}

// View product (opens URL in new tab)
function viewProduct(index: number): void {
  const product = products[index];
  if (product && product.url) {
    window.open(product.url, '_blank');
  }
}

// Delete product
function deleteProduct(index: number): void {
  if (confirm('Are you sure you want to remove this product?')) {
    products.splice(index, 1);
    saveProducts();
    renderProducts();
  }
}

// Request notification permission
async function requestNotificationPermission(): Promise<void> {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

// Show notification
function showNotification(message: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration): void => {
      registration.showNotification('NearBuy Alert', {
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      });
    });
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Periodic price check (placeholder for future implementation)
// @ts-expect-error - Function reserved for future implementation
function _schedulePeriodicPriceCheck(): void {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration): Promise<void> => {
      // @ts-ignore - SyncManager not fully typed
      return registration.sync.register('check-prices');
    });
  }
}

// Export functions for global access (needed for onclick handlers)
declare global {
  interface Window {
    viewProduct: (index: number) => void;
    deleteProduct: (index: number) => void;
  }
}

window.viewProduct = viewProduct;
window.deleteProduct = deleteProduct;