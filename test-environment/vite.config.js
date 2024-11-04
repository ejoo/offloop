import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: 'test-environment',
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist'
    },
    resolve: {
        alias: {
            '@uconnect/offloop': path.resolve(__dirname, '../dist/index.es.js')
        }
    }
}); 