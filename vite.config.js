import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
  // 代理配置
  server: {
    host: '0.0.0.0',
    // https:true,
    cors: true,
    port: 5173,
    open: true,
    proxy: {
      "/sp": {
        target: "https://sp.365246692.xyz/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sp/, '')
      },
      "/bot": {
        target: "https://bot.365246692.xyz/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot/, ''),
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
