import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'test/**/*.{test,spec}.{js,ts}'
    ],
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        'assembly/**', // Exclude AssemblyScript from coverage
        '**/*.config.{js,ts}',
        'test'
      ]
    },
    
    testTimeout: 20000 // CUE network operations may take time
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})