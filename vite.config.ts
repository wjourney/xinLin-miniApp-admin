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
      // '/api2': {
      //   target: 'http://10.142.36.136:30047', // 测试环境的数据地址
      //   changeOrigin: true
      // },
      '/adm': {
        target: 'http://10.151.226.5:3005', // 测试环境的数据地址
        changeOrigin: true
      }
    }
  }
});
