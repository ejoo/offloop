---

id: Custom Storage
title: Custom storage
sidebar_label: Custom storage
slug: /custom-storage
sidebar_position: 2

---

## Using a Custom Storage

To use a custom Storage, you need to implement the `Storage` interface. Below is an example of how to create a custom storage class and use it with the `OfflineProvider`.

### Storage Interface

The `Storage` interface defines the methods that need to be implemented to create a custom storage. Here are the key methods:

- `init(): Promise<void>`: Initializes the storage.
- `save(storeName: string, data: unknown)`: Saves data to the specified store.
- `get<T>(storeName: string, id: string): Promise<T | null>`: Retrieves data by ID from the specified store.
- `delete(storeName: string, id: string): Promise<void>`: Deletes data by ID from the specified store.
- `getAll<T>(storeName: string): Promise<T[]>`: Retrieves all data from the specified store.
- `update(storeName: string, data: unknown): Promise<void>`: Updates data in the specified store.
- `getByContentHash?(storeName: string, contentHash: string): Promise<unknown | null>`: Retrieves data by content hash from the specified store.
- `deleteAll?(storeName: string): Promise<void>`: Deletes all data from the specified store.

### Example Implementation

Below is an example implementation of a custom storage class `ArrayStorage` and how to use it with the `OfflineProvider`.

```typescript

class ArrayStorage implements Storage {
	private data = [];
	init(): Promise<void>;
  save(storeName: string, data: unknown) {
		//
  }
  get<T>(storeName: string, id: string): Promise<T | null>;
  delete(storeName: string, id: string): Promise<void>;
  getAll<T>(storeName: string): Promise<T[]>;
  update(storeName: string, data: unknown): Promise<void>;
  getByContentHash?(
    storeName: string,
    contentHash: string
  ): Promise<unknown | null>;
  deleteAll?(storeName: string): Promise<void>;
}

const instance = new OfflineProvider({ 
	baseUrl: "http://locahost:3000/api"
	storage: new ArrayStorage(),
});

instance.saveEntity("/users", { username: "Ejaz"}); // post api <> indexDB
