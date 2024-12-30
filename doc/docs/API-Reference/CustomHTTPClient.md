---

id: CustomHTTPClient
title: Custom HTTP Client
sidebar_label: Custom HTTP Client
slug: /custom-http-client
sidebar_position: 1

---

## Using a Custom HTTP Client

To use a custom HTTP client, you need to implement the `HttpClient` interface. Below is an example of how to create a custom HTTP client and use it with the `OfflineProvider`.

### HttpClient Interface

The `HttpClient` interface defines the methods that need to be implemented to create a custom HTTP client. Here are the key methods:

- `post(url: string, data: D): Promise<HttpResponse<T>>`: Sends a POST request to the specified URL with the provided data.
- `put(url: string, data: D): Promise<HttpResponse<T>>`: Sends a PUT request to the specified URL with the provided data.
- `delete(url: string): Promise<HttpResponse>`: Sends a DELETE request to the specified URL.
- `get(url: string): Promise<HttpResponse<T>>`: Sends a GET request to the specified URL.
- `request(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: D | null): Promise<HttpResponse<T>>`: Sends a custom request to the specified URL with the provided method and data.

### Example Implementation

```typescript

class CustomHttpClient implements HttpClient {
  post(url: string, data: D): Promise<HttpResponse<T>>{
    // request to the server
  };
  put(url: string, data: D): Promise<HttpResponse<T>>{
    // request to the server
  };
  delete(url: string): Promise<HttpResponse>{
    // request to the server
  };
  get(url: string): Promise<HttpResponse<T>> {
    // request to the server
  };
  // Custom request method to be implemented by the clients.
  request(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: D | null
  ): Promise<HttpResponse<T>> {
    // Custom request implementation
  };
}

const instance = new OfflineProvider({ 
  baseUrl: "http://localhost:3000/api",
  storage: new CustomHttpClient(),
});

instance.saveEntity("/users", { username: "Ejaz" }); // post api <> indexDB
