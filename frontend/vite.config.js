import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: process.env.VITE_BACKEND_HOST || "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },
});
