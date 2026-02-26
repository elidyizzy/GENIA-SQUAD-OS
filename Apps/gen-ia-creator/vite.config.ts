import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Dual build:
// Build A → root: src/ui/  → dist/index.html  (manifest: ui)
// Build B → src/main.ts    → dist/code.js      (manifest: main)

const isSandbox = process.env.BUILD_TARGET === 'sandbox'

// Figma plugin iframe roda sem rede — não suporta ES modules (type="module").
// Este plugin remove o atributo do HTML gerado pelo Vite.
const figmaHtmlCompat = {
  name: 'figma-html-compat',
  transformIndexHtml(html: string): string {
    return html
      .replace(/<script type="module"/g, '<script')
      .replace(/ crossorigin=""/g, '')
      .replace(/ crossorigin/g, '')
  },
}

export default defineConfig({
  plugins: isSandbox ? [] : [react(), figmaHtmlCompat],

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
        // format: 'iife' + inlineDynamicImports: true → bundle único,
        // sem type="module", compatível com o iframe sandboxed do Figma.
        root: resolve(__dirname, 'src/ui'),
        build: {
          outDir: resolve(__dirname, 'dist'),
          emptyOutDir: true,
          rollupOptions: {
            output: {
              format: 'iife',
              inlineDynamicImports: true,
              entryFileNames: 'ui.js',
              assetFileNames: (info) =>
                info.name === 'index.css' ? 'ui.css' : '[name][extname]',
            },
          },
        },
      }),
})
