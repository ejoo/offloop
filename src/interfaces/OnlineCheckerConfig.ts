export interface OnlineCheckerConfig {
  checkInterval?: number;
  timeout?: number;
  check: () => boolean;
}
