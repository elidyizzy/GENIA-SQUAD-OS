import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Dual build:
// Build A → root: src/ui/  → dist/index.html  (manifest: ui)
// Build B → src/main.ts    → dist/code.js      (manifest: main)

const isSandbox = process.env.BUILD_TARGET === 'sandbox'

export default defineConfig({
  plugins: isSandbox ? [] : [react()],

  // Paths relativos — obrigatório para Figma (iframe sem servidor)
  base: './',

  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },

  ...(isSandbox
    ? {
        // ── Build B: Figma sandbox (sem DOM, sem React) ──────────────
        build: {
          lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'code',
            formats: ['iife'],
            fileName: () => 'code.js',
          },
          outDir: 'dist',
          emptyOutDir: false,
          rollupOptions: {
            output: { inlineDynamicImports: true },
          },
        },
      }
    : {
        // ── Build A: React UI ────────────────────────────────────────
        // root = src/ui  →  index.html de src/ui/ vira dist/index.html
        root: resolve(__dirname, 'src/ui'),
        build: {
          outDir: resolve(__dirname, 'dist'),
          emptyOutDir: true,
          rollupOptions: {
            output: {
              entryFileNames: 'ui.js',
              chunkFileNames: 'ui-[hash].js',
              assetFileNames: (info) =>
                info.name === 'index.css' ? 'ui.css' : '[name][extname]',
            },
          },
        },
      }),
})
