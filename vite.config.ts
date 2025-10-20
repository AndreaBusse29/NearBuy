import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        'service-worker': './src/service-worker.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep service-worker.js at root level for PWA registration
          return chunkInfo.name === 'service-worker'
            ? 'service-worker.js'
            : 'assets/[name]-[hash].js';
        },
      },
    },
  },
  server: {
    port: 8080,
  },
});