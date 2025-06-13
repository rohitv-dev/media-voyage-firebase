import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react(),
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: false,
    outDir: `dist/${mode}`,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "${path.join(process.cwd(), "src/_mantine").replace(/\\/g, "/")}" as mantine;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@features": "/src/features",
      // FIXME - Temporary fix for the tabler icons dev issue
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
}));
