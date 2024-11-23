import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IndexDbStorage } from '../src/storages/IndexDbStorage';
import { Storage } from '../src/interfaces/Storage';

describe.skip('IndexDbStorage', () => {
  let storage: Storage;
  let dbMock: IDBDatabase;

  beforeEach(() => {
    // Mock the global indexedDB object

    vi.stubGlobal('indexedDB', {
        open: vi.fn().mockImplementation(() => {
          const validStores = ['entities', 'syncQueue']; // Define valid store names
      
          const mockDb = {
            objectStoreNames: {
              contains: (storeName: string) => validStores.includes(storeName),
            },
            transaction: vi.fn().mockImplementation(() => {
              return {
                objectStore: vi.fn().mockImplementation((storeName: string) => {
                  if (!validStores.includes(storeName)) {
                    throw new Error(`Store "${storeName}" does not exist`);
                  }
      
                  return {
                    put: vi.fn().mockImplementation((data: unknown) => {
                      if (!data || typeof data !== 'object') {
                        throw new Error('Data must contain an "id" property');
                      }
      
                      return {
                        onsuccess: null as unknown as () => void,
                        onerror: null as unknown as () => void,
                      };
                    }),
                  };
                }),
              };
            }),
          };
      
          const request = {
            result: mockDb,
            onsuccess: null as unknown as (event: Event) => void,
            onerror: null as unknown as () => void,
            onupgradeneeded: null as unknown as (event: Event) => void,
          };
      
          // Simulate async IndexedDB behavior
          setTimeout(() => {
            if (request.onsuccess) {
              request.onsuccess({ target: request } as unknown as Event);
            }
          }, 10);
      
          return request as unknown as IDBOpenDBRequest;
        }),
      });
      
      

    storage = new IndexDbStorage('testDb');
    // Mock the 'db' property directly
    dbMock = storage['db'] = {} as IDBDatabase;
  });

  it('should initialize the database successfully', async () => {
    const initSpy = vi.spyOn(storage, 'init');
    await storage.init();
    expect(initSpy).toHaveBeenCalled();
  }, 10000);

  it('should save data to the correct store', async () => {
    const data = { id: '123', name: 'Test Data' };
    const storeName = 'entities';

    await expect(storage.save(storeName, data)).resolves.toBeUndefined();
  });

  it('should throw an error if save is called with invalid data', async () => {
    const invalidData = { name: 'invalid' };
    const storeName = 'entities';

    await expect(storage.save(storeName, invalidData)).rejects.toThrowError(
      'Data must contain an "id" property'
    );
  }, 10000);

  it('should get data from the store', async () => {
    const data = { id: '123', entity: 'entity1', operation: 'get', data: {} };
    const storeName = 'entities';

    (dbMock.transaction(['entities'], 'readonly').objectStore('entities')
      .get as jest.Mock).mockResolvedValueOnce(data);

    const result = await storage.get(storeName, '123');
    expect(result).toEqual(data);
  }, 10000);

  it('should return null if data is not found', async () => {
    const storeName = 'entities';

    (dbMock.transaction(['entities'], 'readonly').objectStore('entities')
      .get as jest.Mock).mockResolvedValueOnce(null);

    const result = await storage.get(storeName, 'nonexistent-id');
    expect(result).toBeNull();
  }, 10000);

  it('should delete data from the store', async () => {
    const storeName = 'entities';
    const id = '123';

    await storage.delete(storeName, id);

    // Check if delete method was called on the store
    expect(
      dbMock.transaction([storeName], 'readwrite').objectStore(storeName).delete
    ).toHaveBeenCalledWith(id);
  }, 10000);

  it('should clear all data from the store', async () => {
    const storeName = 'entities';

    if (storage.deleteAll) {
      await storage.deleteAll(storeName);
    }

    expect(
      dbMock.transaction([storeName], 'readwrite').objectStore(storeName).clear
    ).toHaveBeenCalled();
  }, 10000);

  it('should get all data from the store', async () => {
    const storeName = 'entities';
    const data = [
      { id: '123', entity: 'entity1', operation: 'getAll', data: {} },
    ];

    (dbMock.transaction([storeName], 'readwrite').objectStore(storeName)
      .getAll as jest.Mock).mockResolvedValueOnce(data);

    const result = await storage.getAll(storeName);
    expect(result).toEqual(data);
  }, 10000);

  it('should get data by content hash', async () => {
    const storeName = 'syncQueue';
    const contentHash = 'abc123';
    const data = {
      id: '123',
      contentHash,
      entity: 'sync',
      operation: 'getByContentHash',
      data: {},
    };

    const indexMock = dbMock
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .index('contentHash');
    (indexMock.get as jest.Mock).mockResolvedValueOnce(data);

    const result = await storage.getByContentHash!(storeName, contentHash);
    expect(result).toEqual(data);
  }, 10000);

  it('should throw error if getByContentHash is not implemented', async () => {
    const storeName = 'entities';
    const contentHash = 'abc123';
    const storageWithoutGetByContentHash = new IndexDbStorage('testDb');
    await expect(
      storageWithoutGetByContentHash.getByContentHash!(storeName, contentHash)
    ).rejects.toThrowError('getByContentHash is not implemented');
  }, 10000);
});
