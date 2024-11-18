import { vi, describe, it, expect, beforeEach } from 'vitest';
import { HttpClient, HttpResponse } from '../src/interfaces/HttpClient';

describe('HttpClient', () => {
  let mockHttpClient: HttpClient;

  beforeEach(() => {
    // Mock HttpClient
    mockHttpClient = {
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
      request: vi.fn() as HttpClient['request'],
    };
  });

  it('should call post and return correct response', async () => {
    const mockResponse: HttpResponse = { ok: true, status: 200, data: { message: 'Success' } };
    
    (mockHttpClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const response = await mockHttpClient.post('/api/test', { data: 'test' });
    
    expect(mockHttpClient.post).toHaveBeenCalledWith('/api/test', { data: 'test' });
    expect(response).toEqual(mockResponse);
  });

  it('should handle an error response for post', async () => {
    const mockResponse: HttpResponse = { ok: false, status: 500 };
    
    (mockHttpClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const response = await mockHttpClient.post('/api/test', { data: 'test' });
    
    expect(mockHttpClient.post).toHaveBeenCalledWith('/api/test', { data: 'test' });
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it('should call get and return correct response', async () => {
    const mockResponse: HttpResponse = { ok: true, status: 200, data: { data: 'Some data' } };
    
    (mockHttpClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await mockHttpClient.get('/api/test');
    
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/test');
    expect(response).toEqual(mockResponse);
  });

  it('should call custom request and return correct response', async () => {
    const mockResponse: HttpResponse = { ok: true, status: 200, data: { data: 'Custom response' } };
    
    (mockHttpClient.request as jest.Mock).mockResolvedValue(mockResponse);

    if (mockHttpClient.request) {
      const response = await mockHttpClient.request('/api/test', 'GET');
      expect(mockHttpClient.request).toHaveBeenCalledWith('/api/test', 'GET');
      expect(response).toEqual(mockResponse);
    }
  });
});
