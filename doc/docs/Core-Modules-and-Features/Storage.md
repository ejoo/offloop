---

id: Storage
title: Storage
sidebar_label: Storage
slug: /storage
sidebar_position: 3

---

The `Storage` interface provides methods to manage offline data access and processing in React Native and React applications. By default, it uses IndexedDB, but you can change it to LocalStorage. these store data locally when the app is offline and synchronize it when the connection is restored. THe data is store with the entity name. When offline the getEntity method retrieves the data from the storage.

### Methods

- **init()**: Initializes the storage. Returns a promise that resolves when the initialization is complete.
- **save(storeName: string, data: unknown)**: Saves data to the specified store. Returns a promise that resolves when the data is saved.
- **saveUnique?(storeName: string, data: unknown)**: Optionally saves unique data to the specified store. Returns a promise that resolves when the data is saved.
- **get(storeName: string, id: string)**: Retrieves data by ID from the specified store. Returns a promise that resolves with the data or null if not found.
- **delete(storeName: string, id: string)**: Deletes data by ID from the specified store. Returns a promise that resolves when the data is deleted.
- **getAll(storeName: string)**: Retrieves all data from the specified store. Returns a promise that resolves with an array of data.
- **update(storeName: string, data: unknown)**: Updates data in the specified store. Returns a promise that resolves when the data is updated.
- **getByContentHash?(storeName: string, contentHash: string)**: Optionally retrieves data by content hash from the specified store. Returns a promise that resolves with the data or null if not found.
- **deleteAll?(storeName: string)**: Optionally deletes all data from the specified store. Returns a promise that resolves when all data is deleted.

## IndexedDB Storage

The `IndexDbStorage` implements the `Storage` interface using IndexedDB to store data. IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. It allows for high-performance searches using indexes.

### Initialization

The `init` method initializes the IndexedDB database. It creates object stores for entities and a sync queue if they do not already exist.

### Storing Data

- **save(storeName: string, data: unknown)**: Saves data to the specified store. The data must be an object and contain an `id` property.
- **saveUnique(storeName: string, data: unknown)**: Saves unique data to the specified store. It ensures that each entity is unique by checking the `entity` property.

### Retrieving Data

- **get(storeName: string, id: string)**: Retrieves data by ID from the specified store.
- **getAll(storeName: string)**: Retrieves all data from the specified store.
- **getByContentHash(storeName: string, contentHash: string)**: Retrieves data by content hash from the specified store.

### Deleting Data

- **delete(storeName: string, id: string)**: Deletes data by ID from the specified store.
- **deleteAll(storeName: string)**: Deletes all data from the specified store.

### Updating Data

- **update(storeName: string, data: unknown)**: Updates data in the specified store. This method internally calls the `save` method.

### Handling Requests

The `IndexDbStorage` class handles requests using IndexedDB transactions. Each method creates a transaction and performs the necessary operations (e.g., `put`, `get`, `delete`). The transactions ensure that the operations are atomic and consistent.

## LocalStorage Storage

The `LocalStorage` implements the `Storage` interface using LocalStorage to store data. LocalStorage is a simple key-value storage mechanism available in web browsers, suitable for storing small amounts of data.

### Initialization

The `init` method initializes the LocalStorage storage. It logs a message indicating that the storage has been initialized.

### Storing Data

- **save(storeName: string, data: unknown)**: Saves data to the specified store. The data is serialized to a JSON string and stored with a key that includes a hash of the data.

### Retrieving Data

- **get(storeName: string, id: string)**: Retrieves data by ID from the specified store. The data is deserialized from a JSON string.
- **getAll(storeName: string)**: Retrieves all data from the specified store. It iterates over all keys in LocalStorage and collects the data that matches the store name.

### Deleting Data

- **delete(storeName: string, id: string)**: Deletes data by ID from the specified store. It removes the item from LocalStorage using the key.

### Updating Data

- **update(storeName: string, data: unknown)**: Updates data in the specified store. This method internally calls the `save` method.



