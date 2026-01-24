import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
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
    server: {
        port: 3000,
        open: true,
    },
})
