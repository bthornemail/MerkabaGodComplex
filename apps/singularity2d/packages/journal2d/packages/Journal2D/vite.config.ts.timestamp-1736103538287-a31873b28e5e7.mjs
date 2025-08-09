// vite.config.ts
import { defineConfig } from "file:///home/main/github/unity2d/client/Journal2D/node_modules/vite/dist/node/index.js";
import react from "file:///home/main/github/unity2d/client/Journal2D/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: 'public/ssl/marketplace2d.com/key.pem',
    //   cert: 'public/ssl/marketplace2d.com/cert.pem',
    // },
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      "/api": "http://localhost:3000"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYWluL2dpdGh1Yi91bml0eTJkL2NsaWVudC9Kb3VybmFsMkRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL21haW4vZ2l0aHViL3VuaXR5MmQvY2xpZW50L0pvdXJuYWwyRC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9tYWluL2dpdGh1Yi91bml0eTJkL2NsaWVudC9Kb3VybmFsMkQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIC8vIGh0dHBzOiB7XG4gICAgLy8gICBrZXk6ICdwdWJsaWMvc3NsL21hcmtldHBsYWNlMmQuY29tL2tleS5wZW0nLFxuICAgIC8vICAgY2VydDogJ3B1YmxpYy9zc2wvbWFya2V0cGxhY2UyZC5jb20vY2VydC5wZW0nLFxuICAgIC8vIH0sXG4gICAgcHJveHk6IHtcbiAgICAgIC8vIHN0cmluZyBzaG9ydGhhbmQ6IGh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9mb28gLT4gaHR0cDovL2xvY2FsaG9zdDo0NTY3L2Zvb1xuICAgICAgJy9hcGknOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyx9XG4gIH0gXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLG9CQUFvQjtBQUM3VSxPQUFPLFdBQVc7QUFJbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsSUFBd0I7QUFBQSxFQUNwQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
