import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // 启用 Source Map
  },
  define: {
    'import.meta.env.VITE_BASEURL': JSON.stringify('https://tourney.365246692.xyz/'),
  },
  plugins: [
    vue(),
    VueDevTools(),
    tailwindcss(),
    visualizer({
      open: true, // 构建完成后自动打开报告
    }),
  ],
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
      '/sp': {
        target: 'https://sp.365246692.xyz/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sp/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Private-Network': 'true',
        },
      },
      '/bot': {
        target: 'https://bot.365246692.xyz/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bot/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Private-Network': 'true',
        },
      },
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Private-Network': 'true',
        },
      },
    },
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  esbuild: {
    pure: ['console.log', 'console.debug'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
});
