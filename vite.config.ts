import path from "path"
import react from "@vitejs/plugin-react"
import compression from "vite-plugin-compression"
import { defineConfig } from "vite"
import electron from "vite-plugin-electron"

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    electron({
      entry: "electron/main.js",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})
