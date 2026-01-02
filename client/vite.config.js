import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://resumebuilder-app-eight.vercel.app/',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})