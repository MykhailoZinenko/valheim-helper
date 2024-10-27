import path from "path"
import react from "@vitejs/plugin-react"
import compression from 'vite-plugin-compression'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
