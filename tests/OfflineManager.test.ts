import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { OfflineManager } from '../src/OfflineManager';

describe('OfflineManager', () => {
  let offlineManager: OfflineManager;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStorage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockHttpClient: any;

  beforeEach(() => {
    global.window = ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown) as Window & typeof globalThis;

    mockStorage = {
      init: vi.fn().mockResolvedValue(undefined),
      save: vi.fn().mockResolvedValue(undefined),
      getAll: vi.fn().mockResolvedValue([]),
      get: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
    };

    mockHttpClient = {
      post: vi.fn().mockResolvedValue({ ok: true, data: { id: '123' } }),
      put: vi.fn().mockResolvedValue({ ok: true, data: { id: '123' } }),
      delete: vi.fn().mockResolvedValue({ ok: true }),
    };

    offlineManager = new OfflineManager({
      storage: mockStorage,
      httpClient: mockHttpClient,
      apiBaseUrl: 'https://api.example.com',
      onlineChecker: {
        check: () => true,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).window;
    delete (global as any).navigator;
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
      'entities',
      expect.objectContaining({ name: 'Test', entity: 'users' })
    );
    expect(mockStorage.save).toHaveBeenCalledWith(
      'syncQueue',
      expect.objectContaining({
        entity: 'users',
        operation: 'CREATE',
        data: testData,
      })
    );
  });

  test('should process queue when coming online', async () => {
    const queueItem = {
      id: '123',
      entity: 'users',
      operation: 'CREATE',
      data: { name: 'Test' },
      timestamp: Date.now(),
      retryCount: 0,
    };

    mockStorage.getAll.mockResolvedValueOnce([queueItem]);

    await offlineManager.init();
    offlineManager.isOnline = true;

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://api.example.com/users',
      queueItem.data
    );
    expect(mockStorage.delete).toHaveBeenCalledWith('syncQueue', queueItem.id);
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

  test('should register online/offline event listeners', async () => {
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

  test('should handle online event', async () => {
    await offlineManager.init();

    const [
      [, onlineCallback],
    ] = (window.addEventListener as any).mock.calls.filter(
      ([event]) => event === 'online'
    );

    await onlineCallback();

    expect(offlineManager.isOnline).toBe(true);
  });

  test('should handle offline event', async () => {
    await offlineManager.init();

    const [
      [, offlineCallback],
    ] = (window.addEventListener as any).mock.calls.filter(
      ([event]) => event === 'offline'
    );

    offlineCallback();

    expect(offlineManager.isOnline).toBe(false);
  });
});
