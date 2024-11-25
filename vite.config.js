import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_BASEURL': JSON.stringify("https://tourney.365246692.xyz/")
  },
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
        rewrite: (path) => path.replace(/^\/sp/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Private-Network': true
        }
      },
      "/bot": {
        target: "https://bot.365246692.xyz/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Private-Network': true
        }
      }
    },
  },
  esbuild: {
    pure: [
      'console.log',
      'console.debug',
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  }
});
