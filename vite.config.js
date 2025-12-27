import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 'base: ./' é CRÍTICO para Electron. Sem isso, o EXE não acha os arquivos JS/CSS.
  base: './', 
  build: {
    outDir: 'build',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Aumenta limite para evitar warnings no console
    rollupOptions: {
      output: {
        // Garante organização limpa dos arquivos no build final
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});