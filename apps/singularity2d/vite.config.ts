import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@harmonized': resolve(__dirname, '../../libs/harmonized-components/src'),
      '@cue-core': resolve(__dirname, '../../libs/cue-core/src')
    }
  },
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'Singularity2D',
      formats: ['es', 'umd'],
      fileName: (format) => `singularity2d.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'ethers',
      'd3',
      'graphology'
    ]
  }
});