import { EventManager, EventTypes } from '../EventManager';
import { NetworkMonitor } from '../interfaces/HttpClient';

export class WebNetworkMonitor implements NetworkMonitor {
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine :  true;
  private callbacks: Array<(isOnline: boolean) => void> = [];
  private eventManager = new EventManager();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setStatus(navigator.onLine);
        this.eventManager.emit(EventTypes.ONLINE);
      });
      window.addEventListener('offline', () => {
        this.setStatus(navigator.onLine);
        this.eventManager.emit(EventTypes.OFFLINE);
      });
    }
  }

  

  async checkStatus(): Promise<boolean> {
    return this.online;
  }

  onStatusChange(callback: (isOnline: boolean) => void): void {
    this.callbacks.push(callback);
  }

  private setStatus(status: boolean) {
    if (this.online !== status) {
      this.online = status;
      this.callbacks.forEach((callback) => callback(status));
    }
  }
}
