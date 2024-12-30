---

id: NetworkMonitoring
title: Network Monitoring
sidebar_label: Network Monitoring
slug: /network-monitoring
sidebar_position: 4

---

The network monitoring module is responsible for detecting the online/offline status of the application and managing data synchronization accordingly. This module supports both web and React Native environments, enabling offline data access and processing without requiring manual management.

### How It Works

1. **Environment Detection**:
   - The module first detects the environment (web or React Native) using the `navigator` object.
   - For web environments, it uses the `navigator.onLine` property and `window` events.
   - For React Native environments, it dynamically imports the `@react-native-community/netinfo` library.

2. **Online/Offline Detection**:
   - **Web**: Listens to `online` and `offline` events on the `window` object to update the online status.
   - **React Native**: Uses the `NetInfo` library to fetch the network status and listen for changes.

3. **Status Change Handling**:
   - When the network status changes, the module updates its internal state and notifies registered callbacks.
   - It also emits events (`ONLINE`, `OFFLINE`, `DATA_SYNC`) using an `EventManager` to trigger appropriate actions.

4. **Data Synchronization**:
   - When the application goes online, it triggers a data synchronization process.
   - The `OfflineManager` processes the sync queue and attempts to sync critical data with the server.
   - If the application is offline, data operations are queued for later processing.

