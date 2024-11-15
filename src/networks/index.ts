import { PlatformDetector } from '../utils/PlatformDetect';
import { ReactNativeNetworkMonitor } from './ReactNativeNetworkMonitor';
import { WebNetworkMonitor } from './WebNetworkMonitor';

export const DefaultNetworkMonitor =
  new PlatformDetector().detectPlatform() === 'Mobile'
    ? ReactNativeNetworkMonitor
    : WebNetworkMonitor;
