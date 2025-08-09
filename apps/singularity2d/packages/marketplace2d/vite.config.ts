import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: "src/client", // Root for Vite
  // publicDir: 'packages/client/public',
  // publicDir: 'dist/public',
  build: {
    outDir: "build"//"packages/client/dist"//"../../dist/client", // Output directory
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Proxy API requests to the server
    },
  },
  plugins: [tsconfigPaths(),react()], // Automatically reads `tsconfig.json` paths
  // resolve: {
  //   alias: {
  //     "@shared": "/src/shared", // Use shared code
  //   },
  // },
});
