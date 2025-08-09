import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: 'public/ssl/marketplace2d.com/key.pem',
    //   cert: 'public/ssl/marketplace2d.com/cert.pem',
    // },
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      '/api': 'http://localhost:3000',}
  } 
})
