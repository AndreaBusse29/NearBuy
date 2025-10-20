# Modal Components

This directory contains reusable modal components for the NearBuy application.

## BaseModal Component

A reusable, accessible modal component that provides common modal functionality.

### Features

- **Teleportation**: Uses Vue's Teleport feature to render modals at the document body level
- **Accessibility**: Includes proper ARIA attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- **Keyboard Navigation**: Press ESC to close (configurable)
- **Backdrop Click**: Click outside to close (configurable)
- **Transitions**: Smooth fade-in/fade-out animations
- **Flexible Slots**: Header, body (default), and footer slots for custom content

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `title` | `string` | `''` | Optional title displayed in header |
| `showCloseButton` | `boolean` | `true` | Show/hide close button |
| `closeOnBackdropClick` | `boolean` | `true` | Allow closing by clicking backdrop |
| `closeOnEsc` | `boolean` | `true` | Allow closing by pressing ESC key |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | - | Emitted when modal should close |

### Usage Example

```vue
<template>
  <BaseModal
    :is-open="isModalOpen"
    title="Example Modal"
    @close="closeModal"
  >
    <p>Modal content goes here</p>

    <template #footer>
      <button @click="closeModal">Close</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from './BaseModal.vue';

const isModalOpen = ref(false);

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
```

## AddProductModal Component

A specialized modal for adding new products to track, built on top of BaseModal.

### Features

- Form validation with required fields
- Auto-reset form on close
- Type-safe product creation
- Emits structured product data

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | - | Emitted when modal should close |
| `add-product` | `Product` | Emitted with product data on form submit |

### Usage Example

```vue
<template>
  <AddProductModal
    :is-open="showAddModal"
    @close="showAddModal = false"
    @add-product="handleAddProduct"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddProductModal from './AddProductModal.vue';
import type { Product } from '../types';

const showAddModal = ref(false);

const handleAddProduct = (product: Product) => {
  // Handle new product
  console.log('New product:', product);
  showAddModal.value = false;
};
</script>
```

## Testing

Both components have comprehensive test coverage using Vitest and Vue Test Utils.

Run tests:
```bash
npm test                # Run tests in watch mode
npm test -- --run      # Run tests once
npm run test:coverage  # Run tests with coverage report
npm run test:ui        # Run tests with UI
```

### Test Coverage

**BaseModal** (src/components/__tests__/BaseModal.spec.ts):
- Visibility control
- Title rendering
- Close button behavior
- Backdrop click handling
- Escape key functionality
- Slot rendering (default, header, footer)
- Accessibility attributes

**AddProductModal** (src/components/__tests__/AddProductModal.spec.ts):
- Component rendering
- Form field validation
- Form submission with valid data
- Form submission with missing fields
- Form reset on close
- Close event handling
- Label and accessibility attributes