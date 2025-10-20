import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AddProductModal from '../AddProductModal.vue';
import BaseModal from '../BaseModal.vue';

describe('AddProductModal', () => {
  let wrapper: VueWrapper;

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
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.exists()).toBe(true);
    });

    it('should pass isOpen prop to BaseModal', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.props('isOpen')).toBe(true);
    });

    it('should render form with all required fields', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
        },
      });

      expect(document.querySelector('#product-name')).toBeTruthy();
      expect(document.querySelector('#product-url')).toBeTruthy();
      expect(document.querySelector('#product-store')).toBeTruthy();
      expect(document.querySelector('#product-price')).toBeTruthy();
      expect(document.querySelector('#target-price')).toBeTruthy();
    });
  });

  describe('form interaction', () => {
    it('should update form data when inputs change', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeInput.value = 'Test Store';
      await storeInput.dispatchEvent(new Event('input'));

      priceInput.value = '99.99';
      await priceInput.dispatchEvent(new Event('input'));

      targetPriceInput.value = '79.99';
      await targetPriceInput.dispatchEvent(new Event('input'));

      await wrapper.vm.$nextTick();

      expect(nameInput.value).toBe('Test Product');
      expect(urlInput.value).toBe('https://example.com/product');
      expect(storeInput.value).toBe('Test Store');
      expect(priceInput.value).toBe('99.99');
      expect(targetPriceInput.value).toBe('79.99');
    });

    it('should emit add-product event with product data on form submit', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeInput.value = 'Test Store';
      await storeInput.dispatchEvent(new Event('input'));

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
        store: 'Test Store',
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
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeInput.value = 'Test Store';
      await storeInput.dispatchEvent(new Event('input'));

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
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeInput.value = 'Test Store';
      await storeInput.dispatchEvent(new Event('input'));

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
        },
      });

      // Fill out form
      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      nameInput.value = 'Test Product';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://example.com/product';
      await urlInput.dispatchEvent(new Event('input'));

      storeInput.value = 'Test Store';
      await storeInput.dispatchEvent(new Event('input'));

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
      const storeInputAfter = document.querySelector('#product-store') as HTMLInputElement;
      const priceInputAfter = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInputAfter = document.querySelector('#target-price') as HTMLInputElement;

      expect(nameInputAfter.value).toBe('');
      expect(urlInputAfter.value).toBe('');
      expect(storeInputAfter.value).toBe('');
      expect(priceInputAfter.value).toBe('');
      expect(targetPriceInputAfter.value).toBe('');
    });
  });

  describe('close events', () => {
    it('should emit close event when cancel button is clicked', async () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
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
        },
      });

      const labels = document.querySelectorAll('label');
      const labelTexts = Array.from(labels).map((label) => label.textContent);

      expect(labelTexts).toContain('Product Name');
      expect(labelTexts).toContain('Product URL');
      expect(labelTexts).toContain('Store');
      expect(labelTexts).toContain('Current Price (€)');
      expect(labelTexts).toContain('Target Price (€)');
    });

    it('should have required attribute on all inputs', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      expect(nameInput.required).toBe(true);
      expect(urlInput.required).toBe(true);
      expect(storeInput.required).toBe(true);
      expect(priceInput.required).toBe(true);
      expect(targetPriceInput.required).toBe(true);
    });

    it('should have correct input types', () => {
      wrapper = mount(AddProductModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#product-name') as HTMLInputElement;
      const urlInput = document.querySelector('#product-url') as HTMLInputElement;
      const storeInput = document.querySelector('#product-store') as HTMLInputElement;
      const priceInput = document.querySelector('#product-price') as HTMLInputElement;
      const targetPriceInput = document.querySelector('#target-price') as HTMLInputElement;

      expect(nameInput.type).toBe('text');
      expect(urlInput.type).toBe('url');
      expect(storeInput.type).toBe('text');
      expect(priceInput.type).toBe('number');
      expect(targetPriceInput.type).toBe('number');
    });
  });
});