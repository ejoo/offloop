import { describe, test, expect, beforeEach, vi, afterEach, Mock } from 'vitest';
import { OfflineManager } from '../src/OfflineManager';
import { SyncQueueItem } from '../src/interfaces/SyncQueueItem';
import { SyncQueueManager } from '../src/queue';

describe.skip('OfflineManager', () => {
  let mockHttpClient: {
    post: Mock;
    put: Mock;
    delete: Mock;
    get: Mock;
  };
  let mockStorage: {
    init: Mock;
    save: Mock;
    get: Mock;
    delete: Mock;
    getAll: Mock;
    update: Mock;
  };
  let mockOnlineChecker: { check: Mock };
  let offlineManager: OfflineManager;

  let mockQueueManager: {
    addToQueue: Mock;
    getQueue: Mock;
    processQueue: Mock;
  };
  
  const mockQueue: SyncQueueItem[] = [];
  


beforeEach(() => {

  mockQueueManager = {
    addToQueue: vi.fn(async (item: SyncQueueItem) => {
      console.log('Adding to queue:', item);
      mockQueue.push(item);
      console.log('Queue:', mockQueue);
    }) as unknown as Mock,
    getQueue: vi.fn(async () => mockQueue),
    processQueue: vi.fn(async () => {
      while (mockQueue.length > 0) {
        const item = mockQueue.shift();
        if (item) {
          await mockHttpClient.post(`https://api.example.com/${item.entity}`, item.data);
        }
      }
    }),
  };

  mockHttpClient = {
    post: vi.fn().mockResolvedValue({ ok: true, data: { success: true } }),
    put: vi.fn().mockResolvedValue({ ok: true, data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ ok: true }),
    get: vi.fn().mockResolvedValue({ ok: true, data: { id: 1 } }),
  };
  
  // Mock the Storage
  mockStorage = {
    init: vi.fn().mockResolvedValue(undefined),
    save: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      getAll: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue(undefined),
    };

    // Mock the OnlineChecker
    mockOnlineChecker = {
      check: vi.fn().mockReturnValue(true), // Start online
    };
    
    // Initialize OfflineManager with mocks
    offlineManager = new OfflineManager({
      apiBaseUrl: 'https://api.example.com',
      httpClient: mockHttpClient,
      storage: mockStorage,
      onlineChecker: mockOnlineChecker,
      maxRetries: 3,
      queueManager: mockQueueManager as unknown as SyncQueueManager, // Inject the mock
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as { window?: unknown }).window;
    delete (global as { navigator?: unknown }).navigator;
  });

  test('should save entity online and sync successfully', async () => {
    const testData = { id: '123', name: 'Test' };

    await offlineManager.saveEntity('users', testData, '123');

    expect(mockHttpClient.put).toHaveBeenCalledWith(
      'https://api.example.com/users/123',
      testData
    );
  });

  test('should queue entity when offline', async () => {
    offlineManager.isOnline = false;
    const testData = { name: 'Test' };

    await offlineManager.saveEntity('users', testData);

    expect(mockStorage.save).toHaveBeenCalledWith(
      'syncQueue',
      expect.objectContaining({
        entity: 'users',
        operation: 'CREATE',
        data: testData,
        contentHash: expect.any(String), // Optional: If present
        timestamp: expect.any(Number), // Optional: If present
      })
    );
  });

  test('should process queue when coming online', async () => {
    const queueItem: SyncQueueItem = {
      id: '123',
      entity: 'users',
      operation: 'CREATE',
      data: { name: 'John Doe' },
      timestamp: Date.now(),
      retryCount: 0,
      contentHash: 'hash',
    };
  
    // Add to the queue
    await offlineManager.queueManagerInstance.addToQueue(queueItem);
  
    // Verify the queue has the item
    const queue = await offlineManager.queueManagerInstance.getQueue();
    expect(queue).toHaveLength(1); // Passes now
  
    // Simulate going online
    offlineManager.isOnline = true;
  
    // Trigger data sync
    await offlineManager.triggerDataSync();
  
    // Verify HTTP call
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://api.example.com/users',
      queueItem.data
    );
  
    // Verify queue is processed (empty after sync)
    const processedQueue = await offlineManager.queueManagerInstance.getQueue();
    expect(processedQueue).toHaveLength(0);
  });
  
  

  test('should handle entity deletion', async () => {
    await offlineManager.deleteEntity('users', '123');

    expect(mockStorage.delete).toHaveBeenCalledWith('users', '123');
    expect(mockStorage.save).toHaveBeenCalledWith(
      'syncQueue',
      expect.objectContaining({
        entity: 'users',
        operation: 'DELETE',
        id: '123',
      })
    );
  });

  test('should retrieve entity from local storage', async () => {
    const testData = { id: '123', name: 'Test', entity: 'users' };
    mockStorage.get.mockResolvedValueOnce(testData);

    const result = await offlineManager.getEntity('users', '123');

    expect(mockStorage.get).toHaveBeenCalledWith('entities', '123');
    expect(result).toEqual(testData);
  });

  test.skip('should register online/offline event listeners', async () => {
    await offlineManager.init();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );
  });

  test.skip('should handle online event', async () => {
    await offlineManager.init();

    const [
      [, onlineCallback],
    ] = (window.addEventListener as jest.Mock).mock.calls.filter(
      ([event]) => event === 'online'
    );

    await onlineCallback();

    expect(offlineManager.isOnline).toBe(true);
  });

  test.skip('should handle offline event', async () => {
    await offlineManager.init();

    const [
      [, offlineCallback],
    ] = (window.addEventListener as jest.Mock).mock.calls.filter(
      ([event]) => event === 'offline'
    );

    offlineCallback();

    expect(offlineManager.isOnline).toBe(false);
  });
});
