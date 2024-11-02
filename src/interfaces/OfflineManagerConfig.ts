import { HttpClient, NetworkMonitor } from './HttpClient';
import { Storage } from './Storage';
import { OnlineCheckerConfig } from './OnlineCheckerConfig';

export interface OfflineManagerConfig {
  apiBaseUrl: string;
  dbName?: string;
  syncInterval?: number;
  maxRetries?: number;
  httpClient?: HttpClient;
  storage?: Storage;
  onlineChecker?: OnlineCheckerConfig;
  networkMonitor?: NetworkMonitor;
}
