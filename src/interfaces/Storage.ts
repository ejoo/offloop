export interface Storage {
  init(): Promise<void>;
  save(storeName: string, data: unknown): Promise<void>;
  get<T>(storeName: string, id: string): Promise<T | null>;
  delete(storeName: string, id: string): Promise<void>;
  getAll<T>(storeName: string): Promise<T[]>;
  update(storeName: string, data: unknown): Promise<void>;
  getByContentHash?(
    storeName: string,
    contentHash: string
  ): Promise<unknown | null>;
}

export interface StorageData {
  id: string;
  entity: string;
  operation: string;
  data: unknown;
}
