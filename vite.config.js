import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const viteConfig = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});

export default viteConfig;
