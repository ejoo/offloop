---

id: installation
title: Installation
slug: /installation
sidebar_position: 2

---

## Installation

The **Offloop Library** is easy to integrate into your React and React Native projects. Follow the steps below to get started:

### Prerequisites

Before installing the **Offloop Library**, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (depending on your package manager preference)

### Install the Library

You can install the **Offloop Library** via npm or Yarn, depending on which package manager you prefer:

#### Using npm:

```bash
npm install @uconnect-technologies/offloop
```

<!-- #### Using Yarn:

```bash
yarn add offloop
``` -->

### Verify Installation

To ensure that the installation was successful, try importing the library into one of your files:

```javascript
import { OfflineManager } from 'offloop';

const offlineManager = new OfflineManager({
  apiBaseUrl: 'https://yout-api.example.com',
});
```

If no errors occur, the installation was successful, and you’re ready to start using **Offloop** in your project!

---
