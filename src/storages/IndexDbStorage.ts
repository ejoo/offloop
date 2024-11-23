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
          const entityStore = db.createObjectStore('entities', { keyPath: 'id' });

          entityStore.createIndex('entity', 'entity', { unique: true });
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

  public async saveUnique(storeName: string, data: unknown): Promise<void> {
    console.log('saveUnique');
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
  
      if (!this.db.objectStoreNames.contains(storeName)) {
        reject(new Error(`Store "${storeName}" does not exist`));
        return;
      }
  
      if (typeof data !== 'object' || data === null) {
        reject(new Error('Data must be an object'));
        return;
      }
  
      const dataWithId = data as Record<string, unknown>;
      if (!('entity' in dataWithId)) {
        reject(new Error('Data must contain an "entity" property'));
        return;
      }
  
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
  
      try {
        const index = store.index('entity'); // Ensure an index on the `entity` field exists
        const entity = dataWithId.entity as string;
        const range = IDBKeyRange.only(entity);
        const request = index.openCursor(range);
  
        request.onsuccess = () => {
          const cursor = request.result;
  
          if (cursor) {
            // If a record with the same entity exists, replace it
            const updateRequest = store.put(data); // Overwrite the existing record
            updateRequest.onsuccess = () => {
              console.log(`Updated existing entity: ${entity}`);
              resolve();
            };
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            // If no record with the same entity exists, save the new record
            const saveRequest = store.put(data);
            saveRequest.onsuccess = () => {
              console.log(`Saved new unique entity: ${entity}`);
              resolve();
            };
            saveRequest.onerror = () => reject(saveRequest.error);
          }
        };
  
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
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

  public async deleteAll(storeName: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    if (!this.db.objectStoreNames.contains(storeName)) {
      throw new Error(`Store "${storeName}" does not exist`);
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.clear();
  }
}
