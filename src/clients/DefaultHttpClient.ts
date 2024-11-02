import { HttpClient, HttpResponse } from '../interfaces/HttpClient';

export class DefaultHttpClient implements HttpClient {
  async post<T, D = unknown>(url: string, data: D): Promise<HttpResponse<T>> {
    return fetch(url, { method: 'POST', body: JSON.stringify(data) });
  }

  async put<T, D = unknown>(url: string, data: D): Promise<HttpResponse<T>> {
    return fetch(url, { method: 'PUT', body: JSON.stringify(data) });
  }

  async delete(url: string): Promise<HttpResponse> {
    return fetch(url, { method: 'DELETE' });
  }

  async get<T>(url: string): Promise<HttpResponse<T>> {
    return fetch(url, { method: 'GET' });
  }
}
