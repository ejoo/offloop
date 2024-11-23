import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebNetworkMonitor } from '../src/networks/WebNetworkMonitor';
import { EventManager, EventTypes } from '../src/EventManager';

vi.mock('../src/EventManager', () => ({
  EventManager: vi.fn().mockImplementation(() => ({
    emit: vi.fn(),
  })),
  EventTypes: {
    ONLINE: 'platform-online',
    OFFLINE: 'platform-offline',
  },
}));

describe('WebNetworkMonitor', () => {
  let networkMonitor: WebNetworkMonitor;
  let mockEmit: jest.Mock;

  beforeEach(() => {
    vi.resetAllMocks();
    mockEmit = (vi.fn() as unknown) as jest.Mock<(eventType: string) => void>;
    (EventManager as jest.Mock).mockImplementation(() => ({
      emit: mockEmit,
    }));
    networkMonitor = new WebNetworkMonitor();
  });

  it('should initialize with the correct online status', () => {
    expect(networkMonitor.checkStatus()).resolves.toBe(true);
  });

  it('should update status and emit "online" event when online', () => {
    const callback = vi.fn();
    networkMonitor.onStatusChange(callback);

    networkMonitor.setInitialStatusForTest(false);

    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
    });
    window.dispatchEvent(new Event('online'));

    expect(callback).toHaveBeenCalledWith(true);

    expect(mockEmit).toHaveBeenCalledWith(EventTypes.ONLINE);
  });

  it('should not call callback when offline', () => {
    const callback = vi.fn();
    networkMonitor.onStatusChange(callback);

    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
    });
    window.dispatchEvent(new Event('offline'));

    expect(callback).not.toHaveBeenCalled();

    expect(mockEmit).toHaveBeenCalledWith(EventTypes.OFFLINE);
  });

  it('should not emit events if status does not change', () => {
    const callback = vi.fn();
    networkMonitor.onStatusChange(callback);

    networkMonitor.setInitialStatusForTest(true);

    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
    });
    window.dispatchEvent(new Event('online'));

    expect(callback).not.toHaveBeenCalled();
    expect(mockEmit).toBeCalledTimes(1);
  });
});
