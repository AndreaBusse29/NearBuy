// NearBuy - Main Application Logic

// State management
let products = [];

// DOM Elements
const addProductBtn = document.getElementById('add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const addProductForm = document.getElementById('add-product-form');
const cancelBtn = document.getElementById('cancel-btn');
const closeModalBtn = document.querySelector('.close-modal');
const productsList = document.getElementById('products-list');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }

  // Load products from localStorage
  loadProducts();

  // Render products
  renderProducts();

  // Event listeners
  addProductBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
  addProductForm.addEventListener('submit', handleAddProduct);

  // Close modal when clicking outside
  addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) {
      closeModal();
    }
  });

  // Request notification permission
  requestNotificationPermission();
});

// Load products from localStorage
function loadProducts() {
  const stored = localStorage.getItem('nearbuy-products');
  if (stored) {
    products = JSON.parse(stored);
  }
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem('nearbuy-products', JSON.stringify(products));
}

// Render products to the page
function renderProducts() {
  if (products.length === 0) {
    productsList.innerHTML = `
      <div class="empty-state">
        <p>No products tracked yet</p>
        <p class="hint">Add a product to get started!</p>
      </div>
    `;
    return;
  }

  productsList.innerHTML = products.map((product, index) => `
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
        <button onclick="viewProduct(${index})">View</button>
        <button class="btn-delete" onclick="deleteProduct(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Open add product modal
function openModal() {
  addProductModal.classList.remove('hidden');
  addProductForm.reset();
}

// Close modal
function closeModal() {
  addProductModal.classList.add('hidden');
}

// Handle add product form submission
function handleAddProduct(e) {
  e.preventDefault();

  const product = {
    id: Date.now(),
    name: document.getElementById('product-name').value,
    url: document.getElementById('product-url').value,
    store: document.getElementById('product-store').value,
    price: parseFloat(document.getElementById('product-price').value),
    targetPrice: parseFloat(document.getElementById('target-price').value),
    dateAdded: new Date().toISOString()
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
function viewProduct(index) {
  const product = products[index];
  if (product && product.url) {
    window.open(product.url, '_blank');
  }
}

// Delete product
function deleteProduct(index) {
  if (confirm('Are you sure you want to remove this product?')) {
    products.splice(index, 1);
    saveProducts();
    renderProducts();
  }
}

// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

// Show notification
function showNotification(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('NearBuy Alert', {
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200]
      });
    });
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Periodic price check (placeholder for future implementation)
function schedulePeriodicPriceCheck() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register('check-prices');
    });
  }
}

// Export functions for global access (needed for onclick handlers)
window.viewProduct = viewProduct;
window.deleteProduct = deleteProduct;
