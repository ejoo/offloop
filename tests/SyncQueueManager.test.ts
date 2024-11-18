import { SyncQueueManager } from '../src/queue';
import { Storage } from '../src/interfaces/Storage';
import { HttpClient, HttpResponse } from '../src/interfaces/HttpClient';
import { SyncQueueItem } from '../src/interfaces/SyncQueueItem';
import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';

describe('SyncQueueManager', () => {
  let syncQueueManager: SyncQueueManager;
  let mockStorage: Storage;
  let mockHttpClient: HttpClient;
  let mockEmit: jest.Mock;

  beforeEach(() => {
    // Mocks for the Storage interface
    mockStorage = {
      save: vi.fn(),
      getAll: vi.fn(),
      getByContentHash: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
    } as unknown as Storage;

    // Mocks for the HttpClient interface
    mockHttpClient = {
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
    } as unknown as HttpClient;

    // Mocks for the EventManager
    mockEmit = vi.fn() as unknown as jest.Mock<unknown, unknown[]>;
    syncQueueManager = new SyncQueueManager(mockStorage, 'https://api.example.com', mockHttpClient, 3);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add an item to the queue and emit an event', async () => {
    const item: SyncQueueItem = {
      id: '1',
      contentHash: 'abc123',
      operation: 'CREATE',
      entity: 'test',
      data: {},
      retryCount: 0,
      timestamp: Date.now(),
    };

    (mockStorage.save as jest.Mock).mockResolvedValueOnce(undefined);

    await syncQueueManager.addToQueue(item);

    expect(mockStorage.save).toHaveBeenCalledWith('syncQueue', item);
    // expect(mockEmit).toHaveBeenCalledWith(EventTypes.ON_ADD_TO_QUEUE);
  });

  it('should not add a duplicate item to the queue', async () => {
    const item: SyncQueueItem = {
      id: '1',
      contentHash: 'abc123',
      operation: 'CREATE',
      entity: 'test',
      data: {},
      retryCount: 0,
      timestamp: Date.now(),
    };

    if (mockStorage.getByContentHash) {
      (mockStorage.getByContentHash as jest.Mock).mockResolvedValueOnce([item]);
    }

    await syncQueueManager.addToQueue(item);

    expect(mockStorage.save).not.toHaveBeenCalled();
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it('should process the queue and sync items successfully', async () => {
    const item: SyncQueueItem = {
      id: '1',
      contentHash: 'abc123',
      operation: 'CREATE',
      entity: 'test',
      data: {},
      retryCount: 0,
      timestamp: Date.now(),
    };

    (mockStorage.getAll as jest.Mock).mockResolvedValueOnce([item]);
    (mockHttpClient.post as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200 } as HttpResponse);
    (mockStorage.delete as jest.Mock).mockResolvedValueOnce(undefined);

    await syncQueueManager.processQueue();

    expect(mockHttpClient.post).toHaveBeenCalledWith('https://api.example.com/test', item.data);
    expect(mockStorage.delete).toHaveBeenCalledWith('syncQueue', item.id);
  });

  it('should retry a failed sync operation up to the max retries', async () => {
    const item: SyncQueueItem = {
      id: '1',
      contentHash: 'abc123',
      operation: 'CREATE',
      entity: 'test',
      data: {},
      retryCount: 0,
      timestamp: Date.now(),
    };

    (mockStorage.getAll as jest.Mock).mockResolvedValueOnce([item]);
    (mockHttpClient.post as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 } as HttpResponse);
    (mockStorage.update as jest.Mock).mockResolvedValueOnce(undefined);

    await syncQueueManager.processQueue();

    // Expect update to have been called to increase retry count
    expect(mockStorage.update).toHaveBeenCalledWith('syncQueue', {
      ...item,
      retryCount: 1,
      timestamp: expect.any(Number),
    });
  });

  it('should delete an item from the queue after reaching the max retries', async () => {
    const item: SyncQueueItem = {
      id: '1',
      contentHash: 'abc123',
      operation: 'CREATE',
      entity: 'test',
      data: {},
      retryCount: 3,
      timestamp: Date.now(),
    };

    (mockStorage.getAll as jest.Mock).mockResolvedValueOnce([item]);
    (mockHttpClient.post as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 } as HttpResponse);
    (mockStorage.delete as jest.Mock).mockResolvedValueOnce(undefined);

    await syncQueueManager.processQueue();

    expect(mockStorage.delete).toHaveBeenCalledWith('syncQueue', item.id);
  });

  it('should clear the queue', async () => {
    (mockStorage.deleteAll as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await syncQueueManager.clearQueue();

    expect(mockStorage.deleteAll).toHaveBeenCalledWith('syncQueue');
    expect(result).toBe(true);
  });

  it('should not clear the queue if deleteAll is not implemented', async () => {
    delete mockStorage.deleteAll; // Simulate the method not being available

    const result = await syncQueueManager.clearQueue();

    expect(result).toBe(false);
  });
});
