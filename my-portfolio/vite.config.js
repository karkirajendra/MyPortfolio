import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
      "/uploads": "http://localhost:3001",
      "/auth": "http://localhost:3001",
    },
  },
  build: {
    // three.js alone exceeds the default 500 kB limit; it is already code-split
    chunkSizeWarningLimit: 800,
  },
});
