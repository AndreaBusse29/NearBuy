# Accessibility Fixes Implementation Guide

This document provides code examples and step-by-step instructions for fixing the accessibility issues identified in `ACCESSIBILITY_AUDIT.md`.

---

## Critical Issues

### Issue #1: Fix Button Color Contrast

**File**: `css/styles.css`

**Current code**:
```css
.btn-primary {
  background-color: var(--primary-color); /* #2196F3 - 3.1:1 contrast */
  color: white;
}
```

**Fixed code**:
```css
.btn-primary {
  background-color: var(--primary-dark); /* #1976D2 - 4.6:1 contrast ✓ */
  color: white;
}

.btn-primary:hover {
  background-color: #1565C0; /* Even darker on hover */
}
```

**Update CSS variables**:
```css
:root {
  --primary-color: #2196F3;
  --primary-dark: #1976D2;
  --primary-darker: #1565C0;
}
```

---

### Issue #2: Add Visual Focus Indicators

**File**: `css/styles.css`

**Add to end of file**:
```css
/* Focus Styles for Accessibility */
*:focus {
  outline: none; /* Remove default */
}

*:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Specific focus styles for buttons */
button:focus-visible,
.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

/* Input focus styles */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

/* Link focus styles */
a:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

### Issue #6 & #7: Modal Focus Management and Focus Trap

**File**: `src/components/BaseModal.vue`

**Updated implementation**:
```vue
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
              type="button"
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
/* ... existing styles ... */
</style>
```

---

## High Priority Issues

### Issue #3: Add ARIA Live Regions

**File**: `src/App.vue`

**Add to template**:
```vue
<template>
  <header>
    <h1>NearBuy</h1>
    <p class="tagline">Track products, catch sales</p>
  </header>

  <!-- ARIA Live Region for Status Messages -->
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="sr-only"
  >
    {{ statusMessage }}
  </div>

  <main>
    <!-- ... rest of template ... -->
  </main>
</template>

<script setup lang="ts">
// Add state for status messages
const statusMessage = ref('');

// Update handleAddProduct
const handleAddProduct = (product: Product): void => {
  products.value.push(product);
  saveProducts();
  closeModal();

  // Update status message for screen readers
  statusMessage.value = `${product.name} has been added to your tracked products.`;

  // Clear message after announcement
  setTimeout(() => {
    statusMessage.value = '';
  }, 3000);

  // Check if price is already at or below target
  if (product.price <= product.targetPrice) {
    showNotification(`${product.name} is already at your target price!`);
    statusMessage.value = `${product.name} is already at your target price!`;
  }
};

// Update deleteProduct
const deleteProduct = (productId: number): void => {
  const product = products.value.find(p => p.id === productId);
  if (!product) return;

  if (confirm('Are you sure you want to remove this product?')) {
    products.value = products.value.filter((p) => p.id !== productId);
    saveProducts();
    statusMessage.value = `${product.name} has been removed from your tracked products.`;
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  }
};
</script>
```

**Add to `css/styles.css`**:
```css
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

### Issue #4: Add Accessible Labels to Product Card Buttons

**File**: `src/components/ProductCard.vue`

**Updated template**:
```vue
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
      <button
        :aria-label="`View ${product.name} at ${product.store}`"
        @click="emit('view', product)"
      >
        View
        <span class="sr-only">{{ product.name }} at {{ product.store }}</span>
      </button>
      <button
        class="btn-delete"
        :aria-label="`Delete ${product.name} from tracked products`"
        @click="emit('delete', product.id)"
      >
        Delete
        <span class="sr-only">{{ product.name }}</span>
      </button>
    </div>
  </div>
</template>
```

---

### Issue #5: Replace confirm() with Accessible Modal

**Create new file**: `src/components/ConfirmModal.vue`

```vue
<script setup lang="ts">
import BaseModal from './BaseModal.vue';

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const handleConfirm = (): void => {
  emit('confirm');
};

const handleCancel = (): void => {
  emit('cancel');
};
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="title"
    :close-on-backdrop-click="false"
    @close="handleCancel"
  >
    <p>{{ message }}</p>

    <template #footer>
      <div class="confirm-modal-actions">
        <button
          type="button"
          class="btn-secondary"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          class="btn-danger"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.confirm-modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-danger:hover {
  opacity: 0.9;
}
</style>
```

**Update `src/App.vue`**:
```vue
<script setup lang="ts">
import ConfirmModal from './components/ConfirmModal.vue';

// Add state
const isConfirmModalOpen = ref(false);
const productToDelete = ref<number | null>(null);

// Update deleteProduct
const deleteProduct = (productId: number): void => {
  productToDelete.value = productId;
  isConfirmModalOpen.value = true;
};

const confirmDelete = (): void => {
  if (productToDelete.value !== null) {
    const product = products.value.find(p => p.id === productToDelete.value);
    products.value = products.value.filter((p) => p.id !== productToDelete.value);
    saveProducts();

    if (product) {
      statusMessage.value = `${product.name} has been removed from your tracked products.`;
      setTimeout(() => {
        statusMessage.value = '';
      }, 3000);
    }
  }

  isConfirmModalOpen.value = false;
  productToDelete.value = null;
};

const cancelDelete = (): void => {
  isConfirmModalOpen.value = false;
  productToDelete.value = null;
};
</script>

<template>
  <!-- ... existing template ... -->

  <ConfirmModal
    :is-open="isConfirmModalOpen"
    title="Delete Product"
    message="Are you sure you want to remove this product from tracking?"
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
```

---

## Medium Priority Issues

### Issue #9: External Link Warning

**File**: `src/components/ProductCard.vue`

```vue
<template>
  <div class="product-card">
    <!-- ... existing content ... -->

    <div class="product-actions">
      <button
        :aria-label="`View ${product.name} at ${product.store} (opens in new window)`"
        @click="emit('view', product)"
      >
        View
        <span aria-hidden="true">↗</span>
        <span class="sr-only">(opens in new window)</span>
      </button>
      <!-- ... delete button ... -->
    </div>
  </div>
</template>
```

---

### Issue #11 & #12: Improve Form Validation

**File**: `src/components/AddProductModal.vue`

```vue
<script setup lang="ts">
// Add validation state
const errors = ref<Record<string, string>>({});

// Add validation function
const validateForm = (): boolean => {
  errors.value = {};

  if (!productName.value.trim()) {
    errors.value.productName = 'Product name is required';
  }

  if (!productUrl.value.trim()) {
    errors.value.productUrl = 'Product URL is required';
  } else if (!/^https?:\/\/.+/.test(productUrl.value)) {
    errors.value.productUrl = 'Please enter a valid URL';
  }

  if (!productStore.value.trim()) {
    errors.value.productStore = 'Store name is required';
  }

  if (!productPrice.value || productPrice.value <= 0) {
    errors.value.productPrice = 'Please enter a valid price greater than 0';
  }

  if (!targetPrice.value || targetPrice.value <= 0) {
    errors.value.targetPrice = 'Please enter a valid target price greater than 0';
  }

  return Object.keys(errors.value).length === 0;
};

// Update handleSubmit
const handleSubmit = (): void => {
  if (!validateForm()) return;

  // ... existing code ...
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
        <label for="product-name">
          Product Name
          <span class="required" aria-label="required">*</span>
        </label>
        <input
          id="product-name"
          v-model="productName"
          type="text"
          required
          :aria-invalid="errors.productName ? 'true' : 'false'"
          :aria-describedby="errors.productName ? 'product-name-error' : undefined"
        />
        <span
          v-if="errors.productName"
          id="product-name-error"
          class="error-message"
          role="alert"
        >
          {{ errors.productName }}
        </span>
      </div>

      <div class="form-group">
        <label for="product-url">
          Product URL
          <span class="required" aria-label="required">*</span>
        </label>
        <input
          id="product-url"
          v-model="productUrl"
          type="url"
          required
          :aria-invalid="errors.productUrl ? 'true' : 'false'"
          :aria-describedby="errors.productUrl ? 'product-url-error' : undefined"
        />
        <span
          v-if="errors.productUrl"
          id="product-url-error"
          class="error-message"
          role="alert"
        >
          {{ errors.productUrl }}
        </span>
      </div>

      <!-- Repeat for other fields -->

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
```

**Add to `css/styles.css`**:
```css
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

.form-group input[aria-invalid="true"],
.form-group select[aria-invalid="true"],
.form-group textarea[aria-invalid="true"] {
  border-color: var(--danger-color);
}
```

---

## Low Priority & Best Practices

### Skip Navigation Link

**File**: `src/App.vue`

```vue
<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header>
    <h1>NearBuy</h1>
    <p class="tagline">Track products, catch sales</p>
  </header>

  <main id="main-content" tabindex="-1">
    <!-- ... -->
  </main>
</template>
```

**Add to `css/styles.css`**:
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

### Reduced Motion Support

**File**: `src/components/BaseModal.vue`

```vue
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
</style>
```

---

## Testing Checklist

After implementing fixes, test:

- [ ] All interactive elements have visible focus indicators
- [ ] Modal traps focus correctly
- [ ] Tab/Shift+Tab navigates through modal only
- [ ] ESC closes modal and restores focus
- [ ] Screen reader announces status messages
- [ ] All buttons have unique, descriptive labels
- [ ] Form errors are announced and associated with inputs
- [ ] Required fields are clearly marked
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] External links are identified
- [ ] Skip link appears on focus and works
- [ ] Test with NVDA/JAWS/VoiceOver
- [ ] Test with keyboard only
- [ ] Test at 200% zoom
- [ ] Run axe DevTools
- [ ] Run Lighthouse audit

---

## Deployment Steps

1. Implement critical issues first (focus management, contrast)
2. Add ARIA live regions and accessible labels
3. Improve form validation
4. Add nice-to-have features (skip link, reduced motion)
5. Run automated tests
6. Manual testing with keyboard and screen reader
7. Document changes in release notes
8. Monitor for user feedback

---

## Need Help?

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
