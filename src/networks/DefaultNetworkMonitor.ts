import { NetworkMonitor } from '../interfaces/HttpClient';

export class DefaultNetworkMonitor implements NetworkMonitor {
  private online: boolean = navigator.onLine;
  private callbacks: Array<(isOnline: boolean) => void> = [];

  constructor() {
    window.addEventListener('online', () => this.setStatus(true));
    window.addEventListener('offline', () => this.setStatus(false));
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
