import { NetInfoChangeHandler, NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import { NetworkMonitor } from '../interfaces/HttpClient';
import { EventManager, EventTypes } from '../EventManager';

let NetInfo: {
  addEventListener: (listener: NetInfoChangeHandler) => NetInfoSubscription;
  fetch: () => Promise<NetInfoState>;
} | undefined;

let netInfoReady = false;

if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  import('@react-native-community/netinfo')
    .then(module => {
      NetInfo = module.default;
      netInfoReady = true; // Mark that NetInfo is ready
    })
    .catch(() => {
      console.log('NetInfo is not available');
    });
}

export class ReactNativeNetworkMonitor implements NetworkMonitor {
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine :  true;
  private callbacks: Array<(isOnline: boolean) => void> = [];
  private eventManager = new EventManager();

  constructor() {
    this.initNetworkMonitor();
  }

  async initNetworkMonitor() {
    // Wait until NetInfo is loaded (if in a React Native environment)
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      while (!netInfoReady) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait until netInfo is ready
      }
    }

    // Set up network event listeners
    if (NetInfo) {
      return NetInfo.fetch().then(this.handleStatusChange);
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

  private handleStatusChange = (state: NetInfoState) => {
    if(!state.isConnected) {
        this.eventManager.emit(EventTypes.OFFLINE);
        
    } else {
        this.eventManager.emit(EventTypes.ONLINE);
    }

    this.setStatus(state.isConnected ?? false);
  };
}
