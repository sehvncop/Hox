import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: [
      'content-fix.preview.emergentagent.com',
      'localhost',
      '127.0.0.1',
      '.emergentagent.com'
    ]
  },
  build: {
    outDir: 'dist'
  }
})