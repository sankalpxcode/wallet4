import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hot: true,  // Enable Hot Module Replacement (HMR)
    watch: {
      usePolling: true, // Use polling to detect file changes
      interval: 100, // Set polling interval
    },
  },
  build: {
    minify: "terser", // Use Terser for minification
    sourcemap: true, // Generate source maps for debugging
  },
});
