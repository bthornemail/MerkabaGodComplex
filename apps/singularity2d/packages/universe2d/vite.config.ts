import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // root: "app", // Root for Vite
  // publicDir: 'packages/client/public',
  // publicDir: 'web-dictaphone',
  build: {
    outDir: "build"//"packages/client/dist"//"../../dist/client", // Output directory
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080", // Proxy API requests to the server
    },
  },
  plugins: [tsconfigPaths()], // Automatically reads `tsconfig.json` paths
  // resolve: {
  //   alias: {
  //     "@shared": "/src/shared", // Use shared code
  //   },
  // },
});
