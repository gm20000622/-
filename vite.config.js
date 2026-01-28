import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'docs', // 修改输出目录为docs
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          element: ['element-plus', '@element-plus/icons-vue'],
        }
      }
    }
  }
})