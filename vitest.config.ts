import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // Test environment configuration
    environment: 'node', // Use 'jsdom' for browser-like tests
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'test/**/*.{test,spec}.{js,ts}',
      'packages/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'packages/**/node_modules',
      'packages/**/dist'
    ],
    
    // Global test configuration
    globals: true, // Use global test functions (describe, it, expect)
    clearMocks: true, // Clear mocks between tests
    restoreMocks: true, // Restore mocks after tests
    
    // Coverage configuration
    coverage: {
      provider: 'v8', // Use V8 coverage (faster than c8)
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        'test',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/assembly/**', // Exclude AssemblyScript files
        'packages/**/dist',
        'packages/**/node_modules'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // Test timeout
    testTimeout: 30000, // 30 seconds for CUE network tests
    hookTimeout: 30000,
    
    // Watch mode configuration
    watch: {
      exclude: [
        'node_modules/**',
        'dist/**',
        'packages/**/dist/**',
        'packages/**/node_modules/**'
      ]
    },
    
    // Reporter configuration
    reporter: process.env.CI ? ['junit', 'github-actions'] : ['verbose'],
    outputFile: {
      junit: './test-results.xml'
    },
    
    // Retry configuration for flaky tests
    retry: process.env.CI ? 2 : 0,
    
    // Setup files
    setupFiles: ['./test/setup.ts']
  },
  
  // Vite configuration for tests
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@packages': resolve(__dirname, './packages'),
      '@cue-rectified-prototype': resolve(__dirname, './packages/cue-rectified-prototype/src'),
      '@cue-dashboard': resolve(__dirname, './packages/cue-dashboard/src'),
    }
  },
  
  // Define global constants for tests
  define: {
    __TEST__: true,
    __DEV__: true
  }
})