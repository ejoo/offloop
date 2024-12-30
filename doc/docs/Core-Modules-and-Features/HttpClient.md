---

id: HTTPRequests
title: HTTP Requests
sidebar_label: HTTP Requests
slug: /http-requests
sidebar_position: 2

---

## Overview

The `HTTP Requests` interface is used to manage network requests within the **Offloop Library**. It provides methods for sending and receiving data from APIs and other online services, while respecting offline conditions.

When the device is offline, the library automatically saves the requests to the required storage (indexDB by default) and retries them when the device is back online.

### `HTTP Requests`

The `HTTP Requests` interface provides methods for sending and receiving data from APIs and other online services. It includes the following methods:

- **`postEntity`**: Sends a POST request to the specified entity with the provided data. If offline, the request is saved to indexDB and synced to the API call when online.
- **`getEntity`**: Sends a GET request to the specified entity. If offline, the request is saved to indexDB and retried when online.
- **`deleteEntity`**: Sends a DELETE request to the specified entity. If offline, the request is saved to indexDB and synced to the API call when online.
- **`putEntity`**: Sends a PUT request to the specified entity with the provided data. If offline, the request is saved to indexDB and synced to the API call when online.

### Example Usage

#### Fetch Data from a Network API

This example demonstrates how to fetch data from a network API using the `getEntity` method.

```javascript
import { OfflineManager } from 'offloop';

const offlineManager = new OfflineManager({
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    onlineChecker: {
        check: async () => {
          return true
        },
        timeout: 5000,
    },
});

// Example function to fetch data from a network API
await offlineManager.getEntity('todos')
```

#### Post Data to a Network API

This example demonstrates how to post data to a network API using the `postEntity` method.

```javascript
import { OfflineManager } from 'offloop';

const offlineManager = new OfflineManager({
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    onlineChecker: {
        check: async () => {
          return true
        },
        timeout: 5000,
    },
});

// Example function to post data to a network API
await offlineManager.postEntity('todos', {
        title: 'Test Post',
        body: 'This is a test post',
});
```

#### Delete Data from a Network API

This example demonstrates how to delete data from a network API using the `deleteEntity` method.

```javascript
import { OfflineManager } from 'offloop';

const offlineManager = new OfflineManager({
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    onlineChecker: {
        check: async () => {
          return true
        },
        timeout: 5000,
    },
});

// Example function to delete data from a network API
await offlineManager.deleteEntity('todos', 1);
```

#### Put Data to a Network API

This example demonstrates how to put data to a network API using the `putEntity` method.

```javascript
import { OfflineManager } from 'offloop';

const offlineManager = new OfflineManager({
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    onlineChecker: {
        check: async () => {
          return true
        },
        timeout: 5000,
    },
});

// Example function to put data to a network API
await offlineManager.putEntity('todos', 1, {
        title: 'Test Put',
        body: 'This is a test put',
});
```
