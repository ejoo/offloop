---

id: OfflineManager
title: Offline Manager
sidebar_label: Offline Manager
slug: /offline-manager
sidebar_position: 1

---

## Overview

The `OfflineManager` class is the core component of the **Offloop Library** for managing offline data access and synchronization in your React and React Native apps. By default, it uses **IndexedDB** for offline storage, but it can fall back to **LocalStorage** for smaller data storage needs.


### `OfflineManagerConfig`

Configuration options for the `OfflineManager`.

- **apiBaseUrl**: `string` - The base URL for the API.
- **dbName**: `string` (optional) - The name of the database to use for offline storage.
- **syncInterval**: `number` (optional) - The interval in milliseconds for synchronizing data when online.
- **maxRetries**: `number` (optional) - The maximum number of retry attempts for failed requests.
- **httpClient**: `HttpClient` (optional) - Custom HTTP client for making network requests.
- **storage**: `Storage` (optional) - Custom storage mechanism for offline data.
- **onlineChecker**: `OnlineCheckerConfig` (optional) - Configuration for checking online status.
- **networkMonitor**: `NetworkMonitor` (optional) - Custom network monitor for detecting network changes.
- **queueManager**: `QueueManager` (optional) - Custom queue manager for handling request queues.

## Usage and Examples

### Methods and Features

- **Automatic Offline Management**: Handles the synchronization of network requests when the device goes online and manages data locally while offline.
- **Customizable**: Allows for configuration of offline storage, request synchronization, and more via the `OfflineManagerConfig`.

### Example Usage

```javascript
import { OfflineManager } from 'offloop';

// Instantiate OfflineManager with custom configuration
const offlineManager = new OfflineManager({
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    onlineChecker: {
        check: async () => {
          return true
        },
        timeout: 5000,
    }, // Sync every 5 seconds when online
});

// Example function to fetch data from a network API
async getRequest() {
    try {
      const response = await this.offlineManager.getEntity('todos');
      console.log({response})
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }

// Example function to post data to a network API
async postRequest(data) {
    try {
      const response = await this.offlineManager.postEntity('todos', data);
      console.log({response})
    } catch (error) {
        console.error('Error posting data:', error);
    }
  }
```

---
