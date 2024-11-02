export interface SyncQueueItem {
  id: string;
  entity: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUT';
  data: unknown;
  timestamp: number;
  retryCount: number;
  contentHash?: string;
}
