---

id: QueueProcessor
title: Queue Processor
sidebar_label: Queue Processor
slug: /queue-processor
sidebar_position: 6

---

## Overview

The `QueueProcessor` is a critical component of the **Offloop Library** that handles the processing of queued HTTP requests. It ensures that requests made while offline are stored and then processed once the application regains network connectivity. This allows for seamless offline-first functionality in React and React Native applications.

## How It Works

### 1. HTTP Request Handling

When an HTTP request is made using the `OfflineManager`, the request is intercepted and checked for network connectivity:

- **Online**: If the device is online, the request is sent directly to the server.
- **Offline**: If the device is offline, the request is saved to the local storage (IndexedDB or LocalStorage) and added to the queue for later processing.

### 2. Queue Management

The `QueueManager` is responsible for managing the queue of offline requests. It provides methods to add, retrieve, and delete items from the queue:

- **addToQueue(item: SyncQueueItem)**: Adds an item to the queue.
- **getQueue()**: Retrieves all items from the queue.
- **deleteFromQueue(item: SyncQueueItem)**: Deletes an item from the queue.

### 3. Network Monitoring

The `NetworkMonitor` continuously monitors the network status:

- **Online**: When the device goes online, the `NetworkMonitor` triggers the `QueueProcessor` to process the queued requests.
- **Offline**: When the device is offline, the `NetworkMonitor` ensures that requests are queued for later processing.

### 4. Processing the Queue

The `QueueProcessor` processes the queued requests when the device is online:

- **processQueue()**: Iterates through the queue and attempts to send each request to the server.
- **Retry Mechanism**: If a request fails, the `QueueProcessor` retries the request based on the configured retry logic.
- **Success Handling**: On successful completion of a request, the item is removed from the queue.
- **Failure Handling**: If a request fails after the maximum number of retries, it is logged for further investigation.

### 5. Data Synchronization

The `OfflineManager` ensures data synchronization between the local storage and the server:

- **Sync Interval**: The `OfflineManager` can be configured to sync data at regular intervals when online.
- **Manual Sync**: Developers can manually trigger data synchronization using the `OfflineManager`.
