import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      '.emergent.run',
      '.emergentagent.com',
      '.preview.emergentagent.com',
      'ce4d7f2f-46c9-4d39-91f0-872a6ab6077f.preview.emergentagent.com',
      'localhost'
    ]
  },
  build: {
    outDir: 'dist'
  }
})