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
  private eventEmitter = new EventManager();


  constructor(config: OfflineManagerConfig) {
    this.dbName = config.dbName || 'offlineDB';
    this.apiBaseUrl = config.apiBaseUrl;
    this.httpClient = config.httpClient || new DefaultHttpClient();
    this.storage = config.storage || new IndexDbStorage(this.dbName);
    this.networkMonitor = config.networkMonitor || new DefaultNetworkMonitor();
    if (!config.onlineChecker) {
      throw new Error('Online checker config is required');
    }

    this.queueManager = new SyncQueueManager(
      this.storage,
      this.apiBaseUrl,
      this.httpClient,
      config.maxRetries || 3
    );

    this.networkMonitor = config.networkMonitor || new DefaultNetworkMonitor();
    this.onlineChecker = config.onlineChecker;
    this._isOnline = this.onlineChecker.check();
    this.init();
  }

  get queueManagerInstance(): SyncQueueManager {
    return this.queueManager;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  get queue(): Promise<SyncQueueItem[]> {
    return this.queueManager.getQueue();
  }

  set isOnline(value: boolean) {
    this._isOnline = value;
  }

  public async init(): Promise<void> {    

    this.networkMonitor.onStatusChange((isOnline) => {
      this._isOnline = isOnline;
      if (isOnline) {
        this.eventEmitter.emit(EventTypes.DATA_SYNC);
      }
    });

    this.eventEmitter.on(EventTypes.DATA_SYNC, async () => {
      await this.queueManager.processQueue();
    });

    this.eventEmitter.on(EventTypes.ONLINE, async () => {
      this._isOnline = true
    });

    this.eventEmitter.on(EventTypes.OFFLINE, async () => {
      this._isOnline = false
    });
  
    await this.initializeDB();
  
    // Process the queue if we start in an online state
    if (this._isOnline) {
      await this.queueManager.processQueue();
    }
  }

  private async initializeDB(): Promise<void> {
    await this.storage.init();
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
        await this.queueOperation(entity, data, id);
        return data;
      }
    }

    await this.queueOperation(entity, data, id);
    return data;
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

  public async deleteEntity(entity: string, id: string): Promise<void> {
    const operation: SyncQueueItem = {
      id,
      entity,
      operation: 'DELETE',
      data: { id },
      timestamp: Date.now(),
      retryCount: 0,
    };

    await this.deleteFromLocalDB(entity, id);

    await this.queueManager.addToQueue(operation);

    if (this.isOnline) {
      await this.queueManager.processQueue();
    }
  }

  public async getEntity<T>(entity: string, id: string): Promise<T | null> {
    return this.getFromLocalDB<T>(entity, id);
  }

  public triggerDataSync(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.eventEmitter.emit('DATA_SYNC');
      resolve();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // private async saveToLocalDB(entity: string, data: any): Promise<void> {
  //   if (!data.id) {
  //     data.id = crypto.randomUUID();
  //   }
  //   await this.storage.save('entities', { ...data, entity });
  // }

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
}
