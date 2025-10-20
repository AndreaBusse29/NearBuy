// Shop data model
export interface Shop {
  id: number;
  name: string;
  url: string;
  dateAdded: string;
}

// Product data model
export interface Product {
  id: number;
  name: string;
  url: string;
  store: string;
  price: number;
  targetPrice: number;
  dateAdded: string;
}

// DOM Element references
export interface DOMElements {
  addProductBtn: HTMLButtonElement;
  addProductModal: HTMLElement;
  addProductForm: HTMLFormElement;
  cancelBtn: HTMLButtonElement;
  closeModalBtn: HTMLElement;
  productsList: HTMLElement;
  productNameInput: HTMLInputElement;
  productUrlInput: HTMLInputElement;
  productStoreInput: HTMLInputElement;
  productPriceInput: HTMLInputElement;
  targetPriceInput: HTMLInputElement;
  // Shop management elements (optional - future feature)
  manageShopsBtn?: HTMLButtonElement;
  manageShopsModal?: HTMLElement;
  addShopBtn?: HTMLButtonElement;
  addShopModal?: HTMLElement;
  addShopForm?: HTMLFormElement;
  cancelShopBtn?: HTMLButtonElement;
  closeShopModalBtn?: HTMLElement;
  closeManageShopsBtn?: HTMLElement;
  shopsList?: HTMLElement;
  shopNameInput?: HTMLInputElement;
  shopUrlInput?: HTMLInputElement;
  productStoreSelect?: HTMLSelectElement;
}

// Service Worker types
export interface CacheStorage {
  open(cacheName: string): Promise<Cache>;
  keys(): Promise<string[]>;
  delete(cacheName: string): Promise<boolean>;
  match(request: RequestInfo): Promise<Response | undefined>;
}

// Notification options
export interface PriceAlertOptions extends NotificationOptions {
  body: string;
  icon: string;
  badge: string;
  vibrate: number[];
  tag: string;
  requireInteraction: boolean;
}

// Local Storage keys
export const STORAGE_KEY = 'nearbuy-products' as const;
export const SHOPS_STORAGE_KEY = 'nearbuy-shops' as const;