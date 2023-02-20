import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  appType: 'mpa',
  root   : resolve(__dirname, 'src'),
  server : {
    port      : 5173,
    strictPort: true,
  },
  build  : {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
});
