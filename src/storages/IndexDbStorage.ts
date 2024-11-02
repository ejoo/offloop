import { Storage } from '../interfaces/Storage';

export class IndexDbStorage implements Storage {
  private db: IDBDatabase | null = null;
  private readonly dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
  }

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores for entities and sync queue
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncQueueStore = db.createObjectStore('syncQueue', {
            keyPath: 'id',
          });
          syncQueueStore.createIndex('contentHash', 'contentHash');
        }

        // Create a generic store for entities
        if (!db.objectStoreNames.contains('entities')) {
          db.createObjectStore('entities', { keyPath: 'id' });
        }
      };
    });
  }

  public async save(storeName: string, data: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      if (!this.db.objectStoreNames.contains(storeName)) {
        reject(new Error(`Store "${storeName}" does not exist`));
        return;
      }

      // Type check and ensure data has an id
      if (typeof data !== 'object' || data === null) {
        reject(new Error('Data must be an object'));
        return;
      }

      const dataWithId = data as Record<string, unknown>;
      if (!('id' in dataWithId)) {
        reject(new Error('Data must contain an "id" property'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async get<T>(storeName: string, id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  public async delete(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  public async update(storeName: string, data: unknown): Promise<void> {
    return this.save(storeName, data);
  }

  public async getByContentHash(
    storeName: string,
    contentHash: string
  ): Promise<unknown | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index('contentHash');
      const request = index.get(contentHash);
      console.log('request', request);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
