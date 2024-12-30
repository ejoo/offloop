import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Get Started',
      items: [
        {
          type: 'autogenerated',
          dirName: 'get-started',
        },
      ],
    },
    {
      type: 'category',
      label: 'Core Modules and Features',
      items: [
        {
          type: 'autogenerated',
          dirName: 'Core-Modules-and-Features',
        },
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'autogenerated',
          dirName: 'API-Reference',
        },
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
