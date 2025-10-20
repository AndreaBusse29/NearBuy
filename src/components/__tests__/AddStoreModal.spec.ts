import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AddStoreModal from '../AddStoreModal.vue';
import BaseModal from '../BaseModal.vue';

describe('AddStoreModal', () => {
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
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.exists()).toBe(true);
    });

    it('should pass isOpen prop to BaseModal', () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.props('isOpen')).toBe(true);
    });

    it('should have correct title', () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const baseModal = wrapper.findComponent(BaseModal);
      expect(baseModal.props('title')).toBe('Add Store');
    });

    it('should render form with required fields', () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      expect(document.querySelector('#store-name')).toBeTruthy();
      expect(document.querySelector('#store-url')).toBeTruthy();
    });
  });

  describe('form interaction', () => {
    it('should update form data when inputs change', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      nameInput.value = 'Amazon';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://www.amazon.com';
      await urlInput.dispatchEvent(new Event('input'));

      await wrapper.vm.$nextTick();

      expect(nameInput.value).toBe('Amazon');
      expect(urlInput.value).toBe('https://www.amazon.com');
    });

    it('should emit add-store event with store data on form submit', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      nameInput.value = 'Best Buy';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://www.bestbuy.com';
      await urlInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-store-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('add-store')).toBeTruthy();
      const emittedStore = wrapper.emitted('add-store')?.[0]?.[0] as any;

      expect(emittedStore).toMatchObject({
        name: 'Best Buy',
        url: 'https://www.bestbuy.com',
      });
      expect(emittedStore.id).toBeDefined();
      expect(emittedStore.dateAdded).toBeDefined();
    });

    it('should show validation error when store name is missing', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      urlInput.value = 'https://www.example.com';
      await urlInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-store-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      const errorMessage = document.querySelector('#store-name-error');
      expect(errorMessage?.textContent).toBe('Store name is required');
      expect(wrapper.emitted('add-store')).toBeFalsy();
    });

    it('should show validation error when store URL is missing', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;

      nameInput.value = 'Test Store';
      await nameInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-store-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      const errorMessage = document.querySelector('#store-url-error');
      expect(errorMessage?.textContent).toBe('Store URL is required');
      expect(wrapper.emitted('add-store')).toBeFalsy();
    });

    it('should show validation error for invalid URL format', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      nameInput.value = 'Test Store';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'not-a-valid-url';
      await urlInput.dispatchEvent(new Event('input'));

      const form = document.querySelector('#add-store-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      const errorMessage = document.querySelector('#store-url-error');
      expect(errorMessage?.textContent).toContain('valid URL');
      expect(wrapper.emitted('add-store')).toBeFalsy();
    });
  });

  describe('form reset', () => {
    it('should reset form when modal is closed', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      // Fill out form
      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      nameInput.value = 'Test Store';
      await nameInput.dispatchEvent(new Event('input'));

      urlInput.value = 'https://www.test.com';
      await urlInput.dispatchEvent(new Event('input'));

      // Close modal
      await wrapper.setProps({ isOpen: false });
      await wrapper.vm.$nextTick();

      // Reopen modal
      await wrapper.setProps({ isOpen: true });
      await wrapper.vm.$nextTick();

      // Check that form is reset
      const nameInputAfter = document.querySelector('#store-name') as HTMLInputElement;
      const urlInputAfter = document.querySelector('#store-url') as HTMLInputElement;

      expect(nameInputAfter.value).toBe('');
      expect(urlInputAfter.value).toBe('');
    });

    it('should clear validation errors when modal is closed', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      // Trigger validation error
      const form = document.querySelector('#add-store-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      // Error should exist
      let errorMessage = document.querySelector('#store-name-error');
      expect(errorMessage).toBeTruthy();

      // Close and reopen modal
      await wrapper.setProps({ isOpen: false });
      await wrapper.vm.$nextTick();
      await wrapper.setProps({ isOpen: true });
      await wrapper.vm.$nextTick();

      // Error should be cleared
      errorMessage = document.querySelector('#store-name-error');
      expect(errorMessage).toBeFalsy();
    });
  });

  describe('close events', () => {
    it('should emit close event when cancel button is clicked', async () => {
      wrapper = mount(AddStoreModal, {
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
      wrapper = mount(AddStoreModal, {
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
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const labels = document.querySelectorAll('label');
      const labelTexts = Array.from(labels).map((label) => label.textContent);

      expect(labelTexts.some((text) => text?.includes('Store Name'))).toBe(true);
      expect(labelTexts.some((text) => text?.includes('Store Website URL'))).toBe(true);
    });

    it('should have required attribute on all inputs', () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      expect(nameInput.required).toBe(true);
      expect(urlInput.required).toBe(true);
    });

    it('should have correct input types', () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      const urlInput = document.querySelector('#store-url') as HTMLInputElement;

      expect(nameInput.type).toBe('text');
      expect(urlInput.type).toBe('url');
    });

    it('should have aria-invalid attribute when there are errors', async () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      // Trigger validation error
      const form = document.querySelector('#add-store-form') as HTMLFormElement;
      await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await wrapper.vm.$nextTick();

      const nameInput = document.querySelector('#store-name') as HTMLInputElement;
      expect(nameInput.getAttribute('aria-invalid')).toBe('true');
    });

    it('should have required indicators for required fields', () => {
      wrapper = mount(AddStoreModal, {
        props: {
          isOpen: true,
        },
      });

      const requiredIndicators = document.querySelectorAll('.required');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });
  });
});
