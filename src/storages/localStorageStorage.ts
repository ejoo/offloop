import { Storage } from '../interfaces/Storage';

export class LocalStorageStorage implements Storage {
  private readonly prefix: string;

  constructor(prefix: string = 'offloop') {
    this.prefix = prefix;
  }

  public async init(): Promise<void> {
    console.info('LocalStorageStorage initialized... without config');
  }

  public async save<T = unknown>(storeName: string, data: T): Promise<void> {
    const str = JSON.stringify(data);
    const hash = Array.from(str)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 8);
    const key = `${this.prefix}_${storeName}_${hash}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  public async get<T>(storeName: string, id: string): Promise<T | null> {
    const key = `${this.prefix}_${storeName}_${id}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    const items: T[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.prefix}_${storeName}_`)) {
        const data = localStorage.getItem(key);
        if (data) items.push(JSON.parse(data));
      }
    }
    return items;
  }

  public async update(storeName: string, data: unknown): Promise<void> {
    return this.save(storeName, data);
  }

  public async delete(storeName: string, id: string): Promise<void> {
    const key = `${this.prefix}_${storeName}_${id}`;
    localStorage.removeItem(key);
  }
}
