import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AddProductModal from '../AddProductModal.vue';
import BaseModal from '../BaseModal.vue';
import type { Shop } from '../../types';

describe('AddProductModal', () => {
  let wrapper: VueWrapper;
  const mockStores: Shop[] = [
    { id: 1, name: 'Amazon', url: 'https://www.amazon.com', dateAdded: '2025-01-01' },
    { id: 2, name: 'Best Buy', url: 'https://www.bestbuy.com', dateAdded: '2025-01-02' },
  ];

  beforeEach(() => {
    // Create a div with id="app" for teleport target
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('should render BaseModal component', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.exists()).toBe(true);
    });

    it('should pass isOpen prop to BaseModal', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.props('isOpen')).toBe(true);
    });

    it('should render form with all required fields', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      expect(document.querySelector('#product-name')).toBeTruthy();
      expect(document.querySelector('#product-url')).toBeTruthy();
      expect(document.querySelector('#product-store')).toBeTruthy();
      expect(document.querySelector('#product-price')).toBeTruthy();
      expect(document.querySelector('#target-price')).toBeTruthy();
    });

    it('should render store dropdown with available stores', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      expect(storeSelect).toBeTruthy();
      expect(storeSelect.tagName).toBe('SELECT');

      const options = storeSelect.querySelectorAll('option');
      // Should have: 1 placeholder + 2 stores = 3 options
      expect(options.length).toBe(3);
      expect(options[1].textContent).toBe('Amazon');
      expect(options[2].textContent).toBe('Best Buy');
    });

    it('should show help text when no stores available', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: [],
        },
      });

      const helpText = document.querySelector('#store-help-text');
      expect(helpText?.textContent).toContain('No stores available');
    });
  });

  describe('form interaction', () => {
    it('should update form data when inputs change', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeSelect.value = '1';
      await storeSelect.dispatchEvent(new Event('change'));

      priceInput.value = '99.99';
      await priceInput.dispatchEvent(new Event('input'));

      targetPriceInput.value = '79.99';
      await targetPriceInput.dispatchEvent(new Event('input'));

      await wrapper.vm.$nextTick();

      expect(nameInput.value).toBe('Test Product');
      expect(urlInput.value).toBe('https://example.com/product');
      expect(storeSelect.value).toBe('1');
      expect(priceInput.value).toBe('99.99');
      expect(targetPriceInput.value).toBe('79.99');
    });

    it('should emit add-product event with product data on form submit', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeSelect.value = '1';
      await storeSelect.dispatchEvent(new Event('change'));

      priceInput.value = '99.99';
      await priceInput.dispatchEvent(new Event('input'));

      targetPriceInput.value = '79.99';
      await targetPriceInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-product-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('add-product')).toBeTruthy();
      const emittedProduct = wrapper.emitted('add-product')?.[0]?.[0] as any;

      expect(emittedProduct).toMatchObject({
        name: 'Test Product',
        url: 'https://example.com/product',
        store: 'Amazon',
        price: 99.99,
        targetPrice: 79.99,
      });
      expect(emittedProduct.id).toBeDefined();
      expect(emittedProduct.dateAdded).toBeDefined();
    });

    it('should not emit add-product event if price is not provided', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeSelect.value = '1';
      await storeSelect.dispatchEvent(new Event('change'));

      targetPriceInput.value = '79.99';
      await targetPriceInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-product-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('add-product')).toBeFalsy();
    });

    it('should not emit add-product event if target price is not provided', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeSelect.value = '1';
      await storeSelect.dispatchEvent(new Event('change'));

      priceInput.value = '99.99';
      await priceInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-product-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('add-product')).toBeFalsy();
    });
  });

  describe('form reset', () => {
    it('should reset form when modal is closed', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      // Fill out form
      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeSelect.value = '1';
      await storeSelect.dispatchEvent(new Event('change'));

      priceInput.value = '99.99';
      await priceInput.dispatchEvent(new Event('input'));

      targetPriceInput.value = '79.99';
      await targetPriceInput.dispatchEvent(new Event('input'));

      // Close modal
      await wrapper.setProps({ isOpen: false });
      await wrapper.vm.$nextTick();

      // Reopen modal
      await wrapper.setProps({ isOpen: true });
      await wrapper.vm.$nextTick();

      // Check that form is reset
      const nameInputAfter = document.querySelector('#product-name') as HTMLInputElement;
      const urlInputAfter = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelectAfter = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInputAfter = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInputAfter = document.querySelector('#target-price') as HTMLInputElement;

      expect(nameInputAfter.value).toBe('');
      expect(urlInputAfter.value).toBe('');
      // Select resets to null/empty option
      expect(priceInputAfter.value).toBe('');
      expect(targetPriceInputAfter.value).toBe('');
    });
  });

  describe('close events', () => {
    it('should emit close event when cancel button is clicked', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const cancelButton = document.querySelector('.btn-secondary') as HTMLButtonElement;
      await cancelButton.click();

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should emit close event when BaseModal emits close', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      await baseModal.vm.$emit('close');

      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('labels and accessibility', () => {
    it('should have proper labels for all form fields', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const labels = document.querySelectorAll('label');
      const labelTexts = Array.from(labels).map((label) => label.textContent);

      expect(labelTexts.some((text) => text?.includes('Product Name'))).toBe(true);
      expect(labelTexts.some((text) => text?.includes('Product URL'))).toBe(true);
      expect(labelTexts.some((text) => text?.includes('Store'))).toBe(true);
      expect(labelTexts.some((text) => text?.includes('Current Price'))).toBe(true);
      expect(labelTexts.some((text) => text?.includes('Target Price'))).toBe(true);
    });

    it('should have required attribute on all inputs', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      expect(nameInput.required).toBe(true);
      expect(urlInput.required).toBe(true);
      expect(storeSelect.required).toBe(true);
      expect(priceInput.required).toBe(true);
      expect(targetPriceInput.required).toBe(true);
    });

    it('should have correct input types', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
          stores: mockStores,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeSelect = document.querySelector('#product-store') as HTMLSelectElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      expect(nameInput.type).toBe('text');
      expect(urlInput.type).toBe('url');
      // Store is now a select, not text input
      expect(priceInput.type).toBe('number');
      expect(targetPriceInput.type).toBe('number');
    });
  });
});