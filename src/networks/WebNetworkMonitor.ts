import { EventManager, EventTypes } from '../EventManager';
import { NetworkMonitor } from '../interfaces/HttpClient';

export class WebNetworkMonitor implements NetworkMonitor {
  private online: boolean =
    typeof navigator !== 'undefined' ? navigator.onLine : true;
  private callbacks: Array<(isOnline: boolean) => void> = [];
  private eventManager = new EventManager();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setStatus(true);
        this.eventManager.emit(EventTypes.ONLINE);
      });
      window.addEventListener('offline', () => {
        this.setStatus(false);
        this.eventManager.emit(EventTypes.OFFLINE);
      });
      console.log('web running');
    }
  }

  async checkStatus(): Promise<boolean> {
    return this.online;
  }

  onStatusChange(callback: (isOnline: boolean) => void): void {
    this.callbacks.push(callback);
  }

  public setInitialStatusForTest(status: boolean): void {
    this.online = status;
  }

  private setStatus(status: boolean) {
    if (this.online !== status) {
      this.online = status;
  
      if (this.online === true) {
        this.callbacks.forEach((callback) => callback(status));
      }
    }
  }
}
