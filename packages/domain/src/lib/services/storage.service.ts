
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
export class StorageService {

  constructor(private storage: Storage) {}

  getStorageItem(key: string): string | null{
    return this.storage.getItem(key);
  }

  setStorageItem(key: string, data: string): void {
     this.storage.setItem(key, data);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  clearItems(): void {
    this.storage.clear();
  }
}

