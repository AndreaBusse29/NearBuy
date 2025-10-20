import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import BaseModal from '../BaseModal.vue';

describe('BaseModal', () => {
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

  describe('visibility', () => {
    it('should not render when isOpen is false', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: false,
        },
      });

      expect(document.querySelector('.modal')).toBeNull();
    });

    it('should render when isOpen is true', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      expect(document.querySelector('.modal')).toBeTruthy();
    });
  });

  describe('title', () => {
    it('should display title when provided', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          title: 'Test Modal Title',
        },
      });

      const modalTitle = document.querySelector('#modal-title');
      expect(modalTitle?.textContent).toBe('Test Modal Title');
    });

    it('should not display title element when title is not provided', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      const modalTitle = document.querySelector('#modal-title');
      expect(modalTitle).toBeNull();
    });
  });

  describe('close button', () => {
    it('should display close button by default', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      const closeButton = document.querySelector('.close-modal');
      expect(closeButton).toBeTruthy();
    });

    it('should hide close button when showCloseButton is false', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          showCloseButton: false,
        },
      });

      const closeButton = document.querySelector('.close-modal');
      expect(closeButton).toBeNull();
    });

    it('should emit close event when close button is clicked', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      const closeButton = document.querySelector('.close-modal') as HTMLElement;
      await closeButton.click();

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')?.length).toBe(1);
    });
  });

  describe('backdrop click', () => {
    it('should emit close event when backdrop is clicked and closeOnBackdropClick is true', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          closeOnBackdropClick: true,
        },
      });

      const backdrop = document.querySelector('.modal') as HTMLElement;
      await backdrop.click();

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should not emit close event when backdrop is clicked and closeOnBackdropClick is false', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          closeOnBackdropClick: false,
        },
      });

      const backdrop = document.querySelector('.modal') as HTMLElement;
      await backdrop.click();

      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('should not emit close event when modal content is clicked', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
        slots: {
          default: '<div class="test-content">Test Content</div>',
        },
      });

      const content = document.querySelector('.test-content') as HTMLElement;
      await content.click();

      expect(wrapper.emitted('close')).toBeFalsy();
    });
  });

  describe('escape key', () => {
    it('should emit close event when escape key is pressed and closeOnEsc is true', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          closeOnEsc: true,
        },
      });

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should not emit close event when escape key is pressed and closeOnEsc is false', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          closeOnEsc: false,
        },
      });

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('should not emit close event when other keys are pressed', async () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          closeOnEsc: true,
        },
      });

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('close')).toBeFalsy();
    });
  });

  describe('slots', () => {
    it('should render default slot content', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
        slots: {
          default: '<p class="test-content">Test Content</p>',
        },
      });

      const content = document.querySelector('.test-content');
      expect(content?.textContent).toBe('Test Content');
    });

    it('should render header slot content', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
        slots: {
          header: '<span class="test-header">Custom Header</span>',
        },
      });

      const header = document.querySelector('.test-header');
      expect(header?.textContent).toBe('Custom Header');
    });

    it('should render footer slot content', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
        slots: {
          footer: '<div class="test-footer">Footer Content</div>',
        },
      });

      const footer = document.querySelector('.test-footer');
      expect(footer?.textContent).toBe('Footer Content');
    });
  });

  describe('accessibility', () => {
    it('should have role="dialog"', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      const modal = document.querySelector('.modal');
      expect(modal?.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      const modal = document.querySelector('.modal');
      expect(modal?.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-labelledby when title is provided', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
          title: 'Test Title',
        },
      });

      const modal = document.querySelector('.modal');
      expect(modal?.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    it('should have aria-label on close button', () => {
      wrapper = mount(BaseModal, {
        props: {
          isOpen: true,
        },
      });

      const closeButton = document.querySelector('.close-modal');
      expect(closeButton?.getAttribute('aria-label')).toBe('Close modal');
    });
  });
});
