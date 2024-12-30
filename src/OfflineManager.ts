import { HttpClient, NetworkMonitor } from './interfaces/HttpClient';
import { OfflineManagerConfig } from './interfaces/OfflineManagerConfig';
import { SyncQueueItem } from './interfaces/SyncQueueItem';
import { DefaultHttpClient } from './clients/DefaultHttpClient';
import { Storage } from './interfaces/Storage';
import { IndexDbStorage } from './storages/IndexDbStorage';
import { OnlineCheckerConfig } from './interfaces/OnlineCheckerConfig';
import { SyncQueueManager } from './queue';
import { EventManager, EventTypes } from './EventManager';
import { DefaultNetworkMonitor } from './networks';

export class OfflineManager {
  private readonly dbName: string;
  private readonly apiBaseUrl: string;
  private _isOnline: boolean;
  private readonly httpClient: HttpClient;
  private readonly storage: Storage;
  private readonly queueManager: SyncQueueManager;
  private onlineChecker: OnlineCheckerConfig;
  private networkMonitor: NetworkMonitor;
  private eventEmitter;
  private criticalEntities: string[] = [];

  constructor(config: OfflineManagerConfig) {
    if (!config.apiBaseUrl) {
      throw new Error('API base URL is required');
    }

    this.dbName = config.dbName || 'offlineDB';
    this.apiBaseUrl = config.apiBaseUrl;
    this.httpClient = config.httpClient || new DefaultHttpClient();
    this.storage = config.storage || new IndexDbStorage(this.dbName);
    this.networkMonitor = config.networkMonitor || new DefaultNetworkMonitor();
    this.onlineChecker = config.onlineChecker || { check: () => true };
    this.eventEmitter = new EventManager();

    this._isOnline = this.onlineChecker.check();

    this.queueManager = new SyncQueueManager(
      this.storage,
      this.apiBaseUrl,
      this.httpClient,
      config.maxRetries || 3
    );

    this.init();
  }



  get queueManagerInstance(): SyncQueueManager {
    return this.queueManager;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  set isOnline(value: boolean) {
    this._isOnline = value;
  }

  get queue(): Promise<SyncQueueItem[]> {
    return this.queueManager.getQueue();
  }

  private async init(): Promise<void> {
    this.networkMonitor.onStatusChange((isOnline) => {
      this._isOnline = isOnline;
      if (isOnline) {
        this.eventEmitter.emit(EventTypes.DATA_SYNC);
      }
    });

    this.eventEmitter.on(EventTypes.DATA_SYNC, async () => {
      await this.queueManager.processQueue();
      await this.syncCriticalData();
    });

    this.eventEmitter.on(EventTypes.ONLINE, () => (this._isOnline = true));
    this.eventEmitter.on(EventTypes.OFFLINE, () => (this._isOnline = false));

    await this.initializeDB();

    if (this._isOnline) {
      await this.queueManager.processQueue();
    }
  }

  private async initializeDB(): Promise<void> {
    await this.storage.init();
  }

  public registerCriticalEntities(entities: string[]): void {
    this.criticalEntities = entities;
  }

  private async syncCriticalData(): Promise<void> {
    for (const entity of this.criticalEntities) {
      try {
        const response = await this.httpClient.get(
          `${this.apiBaseUrl}/${entity}`
        );
        if (response.ok && response.data) {
          if (Array.isArray(response.data)) {
            await this.cacheOperation(entity, response.data);
          }
        }
      } catch (error) {
        console.error(`Error syncing critical entity ${entity}:`, error);
      }
    }
  }

  public async getEntity<T extends { id: string | number }>(
    entity: string,
    page: number | string,
    pageSize: number,
    id?: string
  ): Promise<T | unknown | null> {
    if (this._isOnline) {
      try {
        const url = id
          ? `${this.apiBaseUrl}/${entity}/${id}`
          : `${this.apiBaseUrl}/${entity}?page=${page ?? 1}&pageSize=${
              pageSize ?? 10
            }`;

        const response = await this.httpClient.get<T>(url);

        if (response.ok) {
          if (!id) {
            if (Array.isArray(response.data)) {
              await this.cacheOperation(entity, response.data);
            }
          }
          return {
            data: response.data,
            operation: 'GET',
            entity,
            timestamp: Date.now(),
          };
        } else {
          throw new Error(`Failed to fetch ${entity} with ID ${id}`);
        }
      } catch (error) {
        console.error(`Error fetching ${entity} from server:`, error);
        return null;
      }
    } else {
      const cachedData = await this.getCachedFromLocalDB<T>(
        entity,
        id as string
      );
      if (cachedData) {
        console.log('Returning data from cache:', cachedData);
        return ({
          data: cachedData,
          operation:
            cachedData &&
            typeof cachedData === 'object' &&
            'operation' in cachedData
              ? cachedData.operation
              : 'GET',
          entity: (cachedData as { entity: string }).entity || entity,
          timestamp:
            cachedData &&
            typeof cachedData === 'object' &&
            'timestamp' in cachedData
              ? cachedData.timestamp
              : Date.now(),
        } as unknown) as T;
      }
    }
    return null;
  }

  public async postEntity<T>(entity: string, data: T): Promise<T> {
    if (this._isOnline) {
      const endpoint = `${this.apiBaseUrl}/${entity}`;
      try {
        const response = await this.httpClient.post(endpoint, data);
        if (response.ok) {
          return response.data as T;
        } else {
          throw new Error('Error posting data');
        }
      } catch (error) {
        console.error(`Error posting ${entity}:`, error);
        await this.queueOperation(entity, data);
        return data;
      }
    } else {
      await this.queueOperation(entity, data);
      return data;
    }
  }

  public async putEntity<T>(entity: string, id: string | number, data: T): Promise<T> {
    if (this._isOnline) {
      const endpoint = `${this.apiBaseUrl}/${entity}/${id}`;
      try {
        const response = await this.httpClient.put(endpoint, data);
        if (response.ok) {
          return response.data as T;
        } else {
          throw new Error('Error updating data');
        }
      } catch (error) {
        console.error(`Error updating ${entity}:`, error);
        await this.queueOperation(entity, data, id);
        return data;
      }
    } else {
      await this.queueOperation(entity, data, id);
      return data;
    }
  }

  public async deleteEntity(entity: string, id: string): Promise<void> {
    if (this._isOnline) {
      const endpoint = `${this.apiBaseUrl}/${entity}/${id}`;
      try {
        const response = await this.httpClient.delete(endpoint);
        if (response.ok) {
          await this.deleteFromLocalDB(entity, id);
        } else {
          throw new Error('Error deleting data');
        }
      } catch (error) {
        console.error(`Error deleting ${entity}:`, error);
        await this.queueOperation(entity, { id }, 'DELETE');
      }
    } else {
      await this.queueOperation(entity, { id }, 'DELETE');
    }
  }

  private async cacheOperation(entity: string, data: unknown[]): Promise<void> {
    try {
      if (this.storage.saveUnique) {
        const cachedData = await this.getCachedFromLocalDB<{
          id: string | number;
          data: unknown[];
        }>(entity);
        const existingData = (cachedData as { data: unknown[] })?.data || [];

        const mergedData = [
          ...existingData,
          ...data.filter(
            (item) =>
              !existingData.some(
                (existingItem) =>
                  (existingItem as { id: string | number }).id ===
                  (item as { id: string | number }).id
              )
          ),
        ];

        await this.storage.saveUnique('entities', {
          id: entity,
          entity,
          data: mergedData,
          timestamp: Date.now(),
          operation: 'GET',
        });
      }
    } catch (error) {
      console.error('Error saving unique entity:', error);
    }
  }

  private async queueOperation(
    entity: string,
    data: unknown,
    id?: string
  ): Promise<void> {
    const contentHash = await this.createHash(
      `${entity}-${JSON.stringify(data)}`
    );

    const operation: SyncQueueItem = {
      id: id || crypto.randomUUID(),
      entity,
      operation: id ? 'UPDATE' : 'CREATE',
      data,
      timestamp: Date.now(),
      retryCount: 0,
      contentHash,
    };

    await this.queueManager.addToQueue(operation);
  }

  private async createHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  public triggerDataSync(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.eventEmitter.emit(EventTypes.DATA_SYNC);
      resolve();
    });
  }

  // private async getFromLocalDB<T>(
  //   entity: string,
  //   id: string
  // ): Promise<T | null> {
  //   const data = await this.storage.get<T & { entity: string }>('entities', id);
  //   return data && data.entity === entity ? data : null;
  // }

  private async getCachedFromLocalDB<T extends { id: string | number }>(
    entity: string,
    id?: string | number
  ): Promise<T | unknown | null> {
    const data = await this.storage.getAll<T & { entity: string }>('entities');
    const findItem = data.find((item) => item.entity === entity);
    if (id) {
      return findItem
        ? ((findItem as unknown) as { data: T[] }).data.find(
            (d: T) => d.id === id
          )
        : null;
    }
    return findItem ? ((findItem as unknown) as { data: T[] }) : null;
  }

  private async deleteFromLocalDB(entity: string, id: string): Promise<void> {
    await this.storage.delete(entity, id);
  }
}
