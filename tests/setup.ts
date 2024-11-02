import { vi } from 'vitest';

// Mock IndexedDB
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.indexedDB = indexedDB as any;
