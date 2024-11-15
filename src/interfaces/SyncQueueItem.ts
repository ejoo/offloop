export interface SyncQueueItem {
  id: string;
  entity: string;
  operation:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'PUT'
    | 'GET'
    | 'PATCH'
    | 'OPTIONS'
    | 'HEAD';
  data: unknown;
  timestamp: number;
  retryCount: number;
  contentHash?: string;
  baseUrl?: string;
}
