import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/engine': path.resolve(__dirname, './src/engine'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/templates': path.resolve(__dirname, './src/templates'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js}', 'test/**/*.{test,spec}.{ts,tsx,js}'],
  },
})
