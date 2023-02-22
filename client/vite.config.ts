import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'mpa',
  root   : resolve(__dirname, 'src'),
  plugins: [viteReact()],
  server : {
    port      : 5173,
    strictPort: true,
  },
  build  : {
    rollupOptions: {
      input: {
        main : resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/login/index.html'),
      },
    },
  },
});
