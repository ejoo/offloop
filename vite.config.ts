import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'offloop',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@react-native-async-storage/async-storage'],
      output: {
        globals: {
          '@react-native-async-storage/async-storage': 'AsyncStorage',
        },
      },
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  plugins: [dts()],
});
