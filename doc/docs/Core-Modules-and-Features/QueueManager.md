---

id: QueueManager
title: Queue Manager
sidebar_label: Queue Manager
slug: /queue-manager
sidebar_position: 5

---

## Overview

The `QueueManager` is an essential component of the library designed to support React Native/React applications by handling the queuing and synchronization of data. It ensures that data operations are performed reliably and efficiently, even in scenarios where network connectivity is intermittent or unreliable. This allows developers to enable offline data access and processing without having to manage it themselves.

## Key Responsibilities

1. **Queue Management**: The `QueueManager` is responsible for adding, processing, retrieving, and deleting items from the queue.
2. **Data Synchronization**: It ensures that data operations (create, update, delete, get) are synchronized with a remote server.
3. **Retry Mechanism**: The `QueueManager` includes a retry mechanism to handle transient errors and ensure data consistency.
4. **Event Handling**: It integrates with an `EventManager` to handle specific events such as data synchronization and item deletion from the queue.

## Components

### Abstract Class: `QueueManager`

The `QueueManager` abstract class defines the core methods that any queue manager implementation must provide:

- `addToQueue(item: SyncQueueItem): Promise<void>`: Adds an item to the queue.
- `processQueue(): Promise<void>`: Processes the items in the queue.
- `getQueue(): Promise<SyncQueueItem[]>`: Retrieves all items from the queue.
- `deleteFromQueue(item: SyncQueueItem): Promise<void>`: Deletes an item from the queue.

### Concrete Class: `SyncQueueManager`

The `SyncQueueManager` class extends the `QueueManager` and provides a concrete implementation of the queue management and synchronization logic:

- **Constructor**: Initializes the `SyncQueueManager` with storage, API base URL, HTTP client, and maximum retries.
- **addToQueue**: Adds an item to the queue, checking for duplicates based on content hash.
- **processQueue**: Processes the queue, synchronizing each item with the remote server and handling retries for failed operations.
- **getQueue**: Retrieves all items from the queue.
- **deleteFromQueue**: Deletes an item from the queue and emits an event.
- **clearQueue**: Clears all items from the queue, regardless of online status or processing status.

## Importance

The `QueueManager` is crucial for the following reasons:

1. **Offline Support**: It enables React Native/React applications to function seamlessly offline by managing data operations locally and synchronizing them when connectivity is restored.
2. **Reliability**: It ensures that data operations are reliably queued and processed, even in the face of network issues.
3. **Consistency**: By handling retries and synchronization, it maintains data consistency between the client and the server.
4. **Scalability**: The queue management system allows for scalable data operations, handling large volumes of data efficiently.
5. **Event-Driven**: Integration with the `EventManager` allows for responsive and event-driven data processing.

