import {
  HttpClient,
  HttpResponse,
  NetworkMonitor,
} from './interfaces/HttpClient';
import { OfflineManagerConfig } from './interfaces/OfflineManagerConfig';
import { SyncQueueItem } from './interfaces/SyncQueueItem';
import { DefaultHttpClient } from './clients/DefaultHttpClient';
import { Storage } from './interfaces/Storage';
import { IndexDbStorage } from './storages/IndexDbStorage';
import { OnlineCheckerConfig } from './interfaces/OnlineCheckerConfig';
import { DefaultNetworkMonitor } from './networks/DefaultNetworkMonitor';

export class OfflineManager {
  private readonly dbName: string;
  private readonly apiBaseUrl: string;
  private readonly maxRetries: number;
  private _isOnline: boolean;
  private readonly httpClient: HttpClient;
  private readonly storage: Storage;
  private processingQueue: boolean = false;
  private onlineChecker: OnlineCheckerConfig;
  private networkMonitor: NetworkMonitor;
  constructor(config: OfflineManagerConfig) {
    this.dbName = config.dbName || 'offlineDB';
    this.apiBaseUrl = config.apiBaseUrl;
    this.maxRetries = config.maxRetries || 3;
    this.httpClient = config.httpClient || new DefaultHttpClient();
    this.storage = config.storage || new IndexDbStorage(this.dbName);

    if (!config.onlineChecker) {
      throw new Error('Online checker config is required');
    }

    this.networkMonitor = config.networkMonitor || new DefaultNetworkMonitor();
    this.onlineChecker = config.onlineChecker;
    this._isOnline = this.onlineChecker.check();
    this.init();
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  get queue(): Promise<SyncQueueItem[]> {
    return this.getSyncQueue();
  }

  set isOnline(value: boolean) {
    this._isOnline = value;
  }

  public async init(): Promise<void> {
    // Set up event listeners for online/offline status
    window.addEventListener('online', async () => {
      this._isOnline = true;
      await this.processQueue();
    });
    window.addEventListener('offline', () => {
      this._isOnline = false;
    });

    // Initialize IndexedDB
    await this.initializeDB();

    // Process any existing queue items on startup
    if (this._isOnline) {
      await this.processQueue();
    }
  }

  private async initializeDB(): Promise<void> {
    await this.storage.init();
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue || !this._isOnline) return;

    this.processingQueue = true;
    try {
      const queue = await this.storage.getAll<SyncQueueItem>('syncQueue');

      for (const item of queue) {
        try {
          await this.syncItem(item);
          await this.storage.delete('syncQueue', item.id);
        } catch (error) {
          console.error(`Failed to process queue item ${item.id}:`, error);
          if (item.retryCount >= this.maxRetries) {
            await this.storage.delete('syncQueue', item.id);
          } else {
            await this.storage.update('syncQueue', {
              ...item,
              retryCount: item.retryCount + 1,
              timestamp: Date.now(),
            });
          }
        }
      }
    } finally {
      this.processingQueue = false;
    }
  }

  public async saveEntity<T>(entity: string, data: T, id?: string): Promise<T> {
    if (this._isOnline) {
      try {
        const endpoint = `${this.apiBaseUrl}/${entity}`;
        const response = id
          ? await this.httpClient.put<T>(`${endpoint}/${id}`, data)
          : await this.httpClient.post<T>(endpoint, data);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data as T;
      } catch (error) {
        // If online but request fails, queue it
        await this.queueOperation(entity, data, id);
        return data;
      }
    }

    // If offline, queue the operation
    await this.queueOperation(entity, data, id);
    return data;
  }

  private async queueOperation(
    entity: string,
    data: unknown,
    id?: string
  ): Promise<void> {
    // Create a content hash using entity and stringified data
    const contentHash = await this.createHash(
      `${entity}-${JSON.stringify(data)}`
    );

    // Check if an item with this hash already exists in the queue
    let isDuplicate = false;
    if (this.storage.getByContentHash) {
      const existingItems = await this.storage.getByContentHash(
        'syncQueue',
        contentHash
      );
      isDuplicate = !!existingItems;
    } else {
      console.warn(
        'getByContentHash is not implemented, using getAll to check for duplicates which is less efficient'
      );
      const existingItems = await this.storage.getAll<SyncQueueItem>(
        'syncQueue'
      );
      isDuplicate = existingItems.some(
        (item) => item.contentHash === contentHash
      );
    }

    if (isDuplicate) {
      console.log('Duplicate item detected, skipping queue operation');
      return;
    }

    const operation: SyncQueueItem = {
      id: id || crypto.randomUUID(),
      entity,
      operation: id ? 'UPDATE' : 'CREATE',
      data,
      timestamp: Date.now(),
      retryCount: 0,
      contentHash, // Add the hash to the queue item
    };

    // Save to local DB and queue
    await this.saveToLocalDB(entity, data);
    await this.storage.save('syncQueue', operation);
  }

  private async createHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  public async deleteEntity(entity: string, id: string): Promise<void> {
    const operation: SyncQueueItem = {
      id,
      entity,
      operation: 'DELETE',
      data: { id },
      timestamp: Date.now(),
      retryCount: 0,
    };

    // Remove from local DB
    await this.deleteFromLocalDB(entity, id);

    // Add to sync queue
    await this.storage.save('syncQueue', operation);

    // Attempt immediate sync if online
    if (this.isOnline) {
      await this.syncItem(operation);
    }
  }

  public async getEntity<T>(entity: string, id: string): Promise<T | null> {
    return this.getFromLocalDB<T>(entity, id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async saveToLocalDB(entity: string, data: any): Promise<void> {
    // Ensure data has an id property
    if (!data.id) {
      data.id = crypto.randomUUID();
    }
    await this.storage.save('entities', { ...data, entity });
  }

  private async getFromLocalDB<T>(
    entity: string,
    id: string
  ): Promise<T | null> {
    const data = await this.storage.get<T & { entity: string }>('entities', id);
    return data && data.entity === entity ? data : null;
  }

  private async deleteFromLocalDB(entity: string, id: string): Promise<void> {
    await this.storage.delete(entity, id);
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const endpoint = `${this.apiBaseUrl}/${item.entity}`;
    let response: HttpResponse;

    switch (item.operation) {
      case 'CREATE':
        response = await this.httpClient.post(endpoint, item.data);
        break;

      case 'UPDATE':
      case 'PUT':
        response = await this.httpClient.put(
          `${endpoint}/${item.id}`,
          item.data
        );
        break;

      case 'DELETE':
        response = await this.httpClient.delete(`${endpoint}/${item.id}`);
        break;

      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // After successful sync, remove from local DB
    await this.deleteFromLocalDB(item.entity, item.id);
  }

  private async getSyncQueue(): Promise<SyncQueueItem[]> {
    return this.storage.getAll<SyncQueueItem>('syncQueue');
  }
}
