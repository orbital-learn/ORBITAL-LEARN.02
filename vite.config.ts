/**
 * Orbital Learn LMS
 * @author prashB2D (https://github.com/prashB2D)
 * @copyright 2025 Orbital Learn. All rights reserved.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        banner: `/*!
 * Orbital Learn LMS
 * Built by prashB2D — https://github.com/prashB2D
 * © 2025 Orbital Learn. All rights reserved.
 */`
      }
    }
  }
}));
