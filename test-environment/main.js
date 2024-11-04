import { OfflineManager } from '../dist/index.es.js';




class FetchHttpClient {
  post(url, data) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(url, data) {
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(url) {
    return axios.delete(url);
  }

  get(url) {
    return fetch(url);
  }
}

class TestEnvironment {
  constructor() {
    this.offlineManager = new OfflineManager({
      baseURL: 'https://jsonplaceholder.typicode.com',
      onlineChecker: {
        check: () => false,
        delay: 1000,
      },
    //   httpClient: new FetchHttpClient(),
    });

    this.isOnline = true;
    this.setupEventListeners();
    this.updateConnectionStatus();
  }

  setupEventListeners() {
    document
      .getElementById('sendRequest')
      .addEventListener('click', () => this.sendTestRequest());
    document
      .getElementById('toggleConnection')
      .addEventListener('click', () => this.toggleConnection());
    document
      .getElementById('clearQueue')
      .addEventListener('click', () => this.clearQueue());
  }

  log(message) {
    const logOutput = document.getElementById('logOutput');
    const logEntry = document.createElement('div');
    logEntry.textContent = `${new Date().toISOString()} - ${message}`;
    logOutput.appendChild(logEntry);
    logOutput.scrollTop = logOutput.scrollHeight;
  }

  updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.className = `status ${this.isOnline ? 'online' : 'offline'}`;
    statusElement.textContent = `Connection Status: ${
      this.isOnline ? 'Online' : 'Offline'
    }`;
  }

  async sendTestRequest() {
    try {
      this.log('Sending test request...');
      // debugger;
      const response = await this.offlineManager.saveEntity('posts', {
        title: 'Test Post',
        body: 'This is a test post',
      });
      this.log(`Response received: ${JSON.stringify(response)}`);
    } catch (error) {
      this.log(`Error: ${error.message}`);
    }
  }

  toggleConnection() {
    this.isOnline = !this.isOnline;
    this.offlineManager.isOnline = this.isOnline;
    this.updateConnectionStatus();
    this.log(`Connection ${this.isOnline ? 'restored' : 'disabled'}`);
  }

  async clearQueue() {
    try {
      await this.offlineManager.queueManagerInstance.clearQueue();
      this.log('Queue cleared');
    } catch (error) {
      this.log(`Error clearing queue: ${error.message}`);
    }
  }
}

// Initialize the test environment
window.testEnv = new TestEnvironment(); // Assign to window to avoid unused variable warning
