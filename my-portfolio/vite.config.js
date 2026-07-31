import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    // three.js alone exceeds the default 500 kB limit; it is already code-split
    chunkSizeWarningLimit: 800,
  },
});
