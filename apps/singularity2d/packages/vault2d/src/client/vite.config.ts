import { defineConfig } from "vite";
// import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // root: "packages/client", // Root for Vite
  // publicDir: 'packages/client/public',
  publicDir: 'dist/public',
  // build: {
  //   outDir: "app/dist"//"packages/client/dist"//"../../dist/client", // Output directory
  // },
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Proxy API requests to the server
    },
  },
  // plugins: [tsconfigPaths()], // Automatically reads `tsconfig.json` paths
  // resolve: {
  //   alias: {
  //     "@shared": "/src/shared", // Use shared code
  //   },
  // },
});
