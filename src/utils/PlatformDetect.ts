export class PlatformDetector {
  private userAgent: string;

  constructor() {
    this.userAgent = navigator.userAgent || navigator.vendor;
  }

  public detectPlatform(): 'Mobile' | 'Desktop' {
    return this.isMobileDevice() ? 'Mobile' : 'Desktop';
  }

  private isMobileDevice(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/.test(this.userAgent);
  }
}
