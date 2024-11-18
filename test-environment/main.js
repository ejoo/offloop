import { OfflineManager } from '../dist/index.es.js';



// async function isReallyOnline(url = 'https://jsonplaceholder.typicode.com/todos/1') {
//   try {
//     const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
//     return response.ok;
//   } catch (error) {
//     return false;
//   }
// }

class TestEnvironment {
  constructor() {
    this.offlineManager = new OfflineManager({
      apiBaseUrl: 'https://jsonplaceholder.typicode.com',
      onlineChecker: {
        check: async () => {
          return true
        },
        timeout: 5000,
      },
      
    //   httpClient: new FetchHttpClient(),
    });

    
    this.setupEventListeners();
    this.updateConnectionStatus();
    this.isOnline = true;
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
