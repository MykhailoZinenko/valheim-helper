import path from "path"
import react from "@vitejs/plugin-react"
import compression from 'vite-plugin-compression'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), compression({
      algorithm: 'brotliCompress',  // Use 'gzip' for Gzip compression
      ext: '.br',  // '.gz' for gzip
      threshold: 1024,  // Compress files larger than 1KB
      deleteOriginFile: false,  // Keep original files (optional)
    }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
