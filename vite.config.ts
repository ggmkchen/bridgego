import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 相對路徑，適用於本地開發與生產環境
  server: {
    open: true, // 自動開啟瀏覽器
    host: '0.0.0.0', // 將伺服器綁定到 0.0.0.0
    port: process.env.PORT ? Number(process.env.PORT) : 4173, // 將字串轉換為數字
    proxy: {
      '/players': {
        target: 'https://bridge-4204.onrender.com',
        changeOrigin: true,
      },
      '/games': {
        target: 'https://bridge-4204.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html', // 確保正確指向 index.html
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
});
