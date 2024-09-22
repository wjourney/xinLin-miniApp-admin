import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // ↓路径别名
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue', '.json']
  },
  server: {
    proxy: {
      '/adm': {
        target: 'http://124.223.37.126:3005', 
        // target: 'https://11v9336h60.goho.co', 
        changeOrigin: true
      }
    }
  }
});
