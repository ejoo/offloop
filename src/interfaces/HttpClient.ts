export interface HttpResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
}

export interface HttpClient {
  post<T, D = unknown>(url: string, data: D): Promise<HttpResponse<T>>;
  put<T, D = unknown>(url: string, data: D): Promise<HttpResponse<T>>;
  delete(url: string): Promise<HttpResponse>;
  get<T>(url: string): Promise<HttpResponse<T>>;
  // Custom request method to be implemented by the clients.
  request?<T, D = unknown>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: D | null
  ): Promise<HttpResponse<T>>;
}

export interface NetworkMonitor {
  checkStatus(): Promise<boolean>;
  onStatusChange(callback: (isOnline: boolean) => void): void;
}
