import { Storage } from '../interfaces/Storage';
import { SyncQueueItem } from '../interfaces/SyncQueueItem';
import { HttpClient, HttpResponse } from '../interfaces/HttpClient';
import { EventManager, EventTypes } from '../EventManager';

export abstract class QueueManager {
  abstract addToQueue(item: SyncQueueItem): Promise<void>;
  abstract processQueue(): Promise<void>;
  abstract getQueue(): Promise<SyncQueueItem[]>;
  abstract deleteFromQueue(item: SyncQueueItem): Promise<void>;
}

export class SyncQueueManager extends QueueManager {
  private storage: Storage;
  private apiBaseUrl: string;
  private httpClient: HttpClient;
  private maxRetries: number;
  private processingQueue: boolean = false;
  private eventManager = new EventManager();

  constructor(
    storage: Storage,
    apiBaseUrl: string,
    httpClient: HttpClient,
    maxRetries: number = 3
  ) {
    super();
    this.storage = storage;
    this.apiBaseUrl = apiBaseUrl;
    this.httpClient = httpClient;
    this.maxRetries = maxRetries;
    this.eventManager.on(EventTypes.DATA_SYNC, this.processQueue.bind(this));
  }

  async addToQueue(item: SyncQueueItem): Promise<void> {
    if (item.contentHash) {
      const isDuplicate = await this.checkDuplicate(item.contentHash);
      if (isDuplicate) {
        console.log('Duplicate item detected, skipping queue operation');
        return;
      }
    }

    await this.storage.save('syncQueue', item);
  }

  private async checkDuplicate(contentHash: string): Promise<boolean> {
    const existingItems = this.storage.getByContentHash
      ? await this.storage.getByContentHash('syncQueue', contentHash)
      : null;
    return !!existingItems;
  }

  async processQueue(): Promise<void> {
    if (this.processingQueue) return;
  
    this.processingQueue = true;
  
    try {
      const queue = await this.getQueue();
  
      const promises = queue.map(async (item) => {
        try {
          await this.syncItem(item);
          await this.deleteFromQueue(item);
        } catch (error) {
          console.error(`Failed to process queue item ${item.id}:`, error);
          if (item.retryCount >= this.maxRetries) {
            await this.deleteFromQueue(item);
          } else {
            await this.storage.update('syncQueue', {
              ...item,
              retryCount: item.retryCount + 1,
              timestamp: Date.now(),
            });
          }
        }
      });
  
      await Promise.allSettled(promises);
    } finally {
      this.processingQueue = false;
    }
  }

  async getQueue(): Promise<SyncQueueItem[]> {
    return this.storage.getAll<SyncQueueItem>('syncQueue');
  }

  async deleteFromQueue(item: SyncQueueItem): Promise<void> {
    await this.storage.delete('syncQueue', item.id);
    this.eventManager.emit(EventTypes.ON_DELETE_FROM_QUEUE);
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const endpoint = `${this.apiBaseUrl}/${item.entity}`;
    let response: HttpResponse = { ok: false, status: 0, data: null };

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

      case 'GET':
        response = await this.httpClient.get(`${endpoint}/${item.id}`);
        break;
    }

    if (!response.ok) {
      throw new Error(`Failed to sync item ${item.id}`);
    }
  }
  async clearQueue(): Promise<boolean> {
    console.warn(
      'Clearing queue regardless of online status or processing status'
    );

    if (this.storage.deleteAll) {
      await this.storage.deleteAll('syncQueue');
      return true;
    }

    console.warn(
      'Failed to clear queue as deleteAll is not implemented in given storage'
    );
    return false;
  }
}
